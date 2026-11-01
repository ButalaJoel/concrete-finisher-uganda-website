import PDFDocument from "pdfkit";
import { Buffer } from "node:buffer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const formatCurrency = (amount) =>
    `${new Intl.NumberFormat("en-UG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Number(amount))} UGX`;

const formatDate = (date, format = "DD/MM/YYYY") => {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "";

    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();

    if (format === "MM/DD/YYYY") return `${month}/${day}/${year}`;
    if (format === "YYYY-MM-DD") return `${year}-${month}-${day}`;
    return `${day}/${month}/${year}`;
};

const smallNumberWords = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen",
];
const tensWords = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
];

const integerToWords = (value) => {
    if (value < 20) return smallNumberWords[value];
    if (value < 100) {
        return `${tensWords[Math.floor(value / 10)]}${value % 10 ? `-${smallNumberWords[value % 10]}` : ""}`;
    }
    if (value < 1000) {
        return `${smallNumberWords[Math.floor(value / 100)]} hundred${value % 100 ? ` ${integerToWords(value % 100)}` : ""}`;
    }

    for (const [size, label] of [
        [1_000_000_000, "billion"],
        [1_000_000, "million"],
        [1_000, "thousand"],
    ]) {
        if (value >= size) {
            const remainder = value % size;
            return `${integerToWords(Math.floor(value / size))} ${label}${remainder ? ` ${integerToWords(remainder)}` : ""}`;
        }
    }

    return "";
};

const amountInWords = (amount) => {
    const value = Number(amount);
    const whole = Math.floor(value);
    const decimalDigits = String(value).split(".")[1]?.replace(/0+$/, "");
    const words = integerToWords(whole);
    return `${words} Ugandan shillings${decimalDigits ? ` point ${[...decimalDigits].map((digit) => smallNumberWords[Number(digit)]).join(" ")}` : ""} only`;
};

const loadLogo = async (logo) => {
    if (!logo) return null;

    if (/^https?:\/\//i.test(logo)) {
        const response = await fetch(logo);
        if (!response.ok) {
            throw new Error(`Unable to load company logo (${response.status}).`);
        }
        return Buffer.from(await response.arrayBuffer());
    }

    if (logo.startsWith("/uploads/")) {
        const absolutePath = path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "..",
            logo.replace(/^[/\\]+/, "")
        );
        if (fs.existsSync(absolutePath)) return fs.readFileSync(absolutePath);
        console.warn("Payment receipt logo file not found:", absolutePath);
    }

    return null;
};

const generatePaymentReceiptPdf = async (receipt) => {
    const company = receipt.companySnapshot || {};
    let logo = null;
    try {
        logo = await loadLogo(company.logo);
    } catch (error) {
        console.warn("Unable to load payment receipt logo:", error.message);
    }

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
            size: "A4",
            margins: { top: 42, bottom: 42, left: 48, right: 48 },
            info: {
                Title: `Payment Receipt ${receipt.receiptNumber}`,
                Author: company.companyName || "Concrete Finisher Uganda",
                Subject: "Payment Receipt",
            },
        });
            const chunks = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            const brown = "#5A2E1B";
            const orange = "#B8732E";
            const dark = "#1F2D3D";
            const muted = "#667085";
            const border = "#E5E0DA";
            const left = doc.page.margins.left;
            const right = doc.page.width - doc.page.margins.right;
            const width = right - left;
            const headerY = 44;

            if (logo) {
                try {
                    doc.image(logo, left, headerY, { fit: [86, 56] });
                } catch (error) {
                    console.warn("Unable to render payment receipt logo:", error.message);
                }
            }

            const companyX = logo ? left + 102 : left;
            doc.fillColor(dark).font("Helvetica-Bold").fontSize(17)
                .text(company.companyName || "Concrete Finisher Uganda", companyX, headerY);
            const contactLines = [
                company.physicalAddress,
                [company.phoneNumber, company.email].filter(Boolean).join(" | "),
                company.website,
            ].filter(Boolean);
            doc.fillColor(muted).font("Helvetica").fontSize(8.5)
                .text(contactLines.join("\n"), companyX, headerY + 24, {
                    width: right - companyX,
                    lineGap: 2,
                });

        const headerBottom = Math.max(doc.y, headerY + 58);
        doc.moveTo(left, headerBottom + 12).lineTo(right, headerBottom + 12)
            .lineWidth(1).strokeColor(border).stroke();

        const titleY = headerBottom + 28;
        doc.fillColor(brown).font("Helvetica-Bold").fontSize(21)
            .text("PAYMENT RECEIPT", left, titleY);
        doc.fillColor(muted).font("Helvetica").fontSize(9)
            .text("Proof of payment received", left, titleY + 28);
        doc.fillColor(orange).font("Helvetica-Bold").fontSize(12)
            .text(receipt.receiptNumber, right - 190, titleY + 2, {
                width: 190,
                align: "right",
            });
        doc.fillColor(muted).font("Helvetica").fontSize(9)
            .text(`Issue date: ${formatDate(receipt.createdAt, receipt.dateFormat)}`, right - 190, titleY + 22, {
                width: 190,
                align: "right",
            });
        doc.text(`Payment date: ${formatDate(receipt.paymentDate, receipt.dateFormat)}`, right - 190, titleY + 37, {
            width: 190,
            align: "right",
        });

        let y = titleY + 72;
        const sectionHeading = (text) => {
            doc.fillColor(brown).font("Helvetica-Bold").fontSize(10).text(text, left, y);
            y = doc.y + 10;
        };
        const row = (label, value, options = {}) => {
            const rowHeight = options.height || 23;
            doc.fillColor(muted).font("Helvetica").fontSize(9)
                .text(label, left, y, { width: 142 });
            doc.fillColor(dark).font(options.bold ? "Helvetica-Bold" : "Helvetica").fontSize(9.5)
                .text(value || "-", left + 146, y, { width: width - 146 });
            y += Math.max(rowHeight, doc.heightOfString(value || "-", { width: width - 146, font: options.bold ? "Helvetica-Bold" : "Helvetica", fontSize: 9.5 }) + 8);
        };

        sectionHeading("RECEIVED FROM");
        row("Customer", receipt.customer?.fullName);
        row("Phone", receipt.customer?.phoneNumber);
        if (receipt.customer?.email) row("Email", receipt.customer.email);

        y += 6;
        sectionHeading("PAYMENT DETAILS");
        row("Project / description", receipt.projectDescription, { height: 32 });
        row("Payment method", receipt.paymentMethod);
        if (receipt.transactionReference) row("Transaction reference", receipt.transactionReference);
        if (receipt.quotationNumber) row("Related quotation", receipt.quotationNumber);
        row("Payment received by", receipt.receivedBy);
        if (receipt.notes) row("Notes", receipt.notes, { height: 32 });

        y += 6;
        const amountBoxY = y;
        doc.roundedRect(left, amountBoxY, width, 74, 8)
            .fillAndStroke("#F7F3EF", border);
        doc.fillColor(muted).font("Helvetica-Bold").fontSize(8.5)
            .text("AMOUNT RECEIVED", left + 16, amountBoxY + 13);
        doc.fillColor(orange).font("Helvetica-Bold").fontSize(21)
            .text(formatCurrency(receipt.amountReceived), left + 16, amountBoxY + 29);
        doc.fillColor(dark).font("Helvetica").fontSize(9)
            .text(`In words: ${amountInWords(receipt.amountReceived)}`, left + 16, amountBoxY + 56, {
                width: width - 32,
            });

        if (receipt.status === "Voided") {
            doc.save();
            doc.rotate(-28, { origin: [doc.page.width / 2, amountBoxY + 38] });
            doc.fillColor("#B42318").opacity(0.16).font("Helvetica-Bold").fontSize(52)
                .text("VOIDED", left, amountBoxY + 15, { width, align: "center" });
            doc.restore();
            doc.opacity(1);
        }

        y = amountBoxY + 108;
        doc.fillColor(muted).font("Helvetica").fontSize(8.5)
            .text("This receipt confirms only the amount stated above was received.", left, y, {
                width,
                align: "center",
            });

        y += 44;
        const signatureWidth = 190;
        doc.moveTo(left, y + 24).lineTo(left + signatureWidth, y + 24)
            .strokeColor("#98A2B3").lineWidth(0.8).stroke();
        doc.fillColor(muted).font("Helvetica").fontSize(8.5)
            .text("Authorized signature", left, y + 31, { width: signatureWidth, align: "center" });
        doc.moveTo(right - signatureWidth, y + 24).lineTo(right, y + 24)
            .strokeColor("#98A2B3").lineWidth(0.8).stroke();
        doc.text("Name / stamp", right - signatureWidth, y + 31, { width: signatureWidth, align: "center" });

        if (company.whatsappNumber) {
            doc.fillColor(muted).fontSize(8)
                .text(`WhatsApp: ${company.whatsappNumber}`, left, doc.page.height - 42, {
                    width,
                    align: "center",
                });
        }
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export default generatePaymentReceiptPdf;
