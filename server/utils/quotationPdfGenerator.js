// ======================================================
// FILE: quotationPdfGenerator.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Generates professional official quotation PDFs.
//
// IMPORTANT:
// The quotation data comes from MongoDB.
// The quotation's companySnapshot and settingsSnapshot
// are used so historical quotations remain accurate.
// ======================================================

import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";


// ======================================================
// FORMAT CURRENCY
// ======================================================

const formatCurrency = (amount, currencyDisplay = "UGX") => {

    const numericAmount =
        Number(amount || 0);

    return new Intl.NumberFormat(
        "en-UG",
        {
            maximumFractionDigits: 0,
        }
    ).format(numericAmount) + ` ${currencyDisplay}`;

};


// ======================================================
// FORMAT DATE
// ======================================================

const formatDate = (
    date,
    dateFormat = "DD/MM/YYYY"
) => {

    if (!date) {
        return "";
    }

    const parsedDate =
        new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const day =
        String(
            parsedDate.getDate()
        ).padStart(2, "0");

    const month =
        String(
            parsedDate.getMonth() + 1
        ).padStart(2, "0");

    const year =
        parsedDate.getFullYear();

    if (dateFormat === "MM/DD/YYYY") {
        return `${month}/${day}/${year}`;
    }

    if (dateFormat === "YYYY-MM-DD") {
        return `${year}-${month}-${day}`;
    }

    return `${day}/${month}/${year}`;

};


// ======================================================
// LOAD LOGO
//
// The Company model stores the logo path.
//
// Supported:
// • Local uploaded logo:
//   /uploads/company/example.png
//
// • Remote logo:
//   https://example.com/logo.png
//
// If the logo cannot be loaded, PDF generation
// continues without the logo.
// ======================================================

const loadLogo = async (logo) => {

    // --------------------------------------------------
    // NO LOGO
    // --------------------------------------------------

    if (!logo) {
        return null;
    }


    try {

        // ----------------------------------------------
        // REMOTE IMAGE
        // ----------------------------------------------

        if (
            typeof logo === "string" &&
            /^https?:\/\//i.test(logo)
        ) {

            const response =
                await fetch(logo);


            if (!response.ok) {

                return null;

            }


            const arrayBuffer =
                await response.arrayBuffer();


            return Buffer.from(
                arrayBuffer
            );

        }


        // ----------------------------------------------
        // LOCAL UPLOADED IMAGE
        // ----------------------------------------------

        if (
            typeof logo === "string" &&
            logo.startsWith("/uploads/")
        ) {

            const relativePath =
                logo.replace(
                    /^[/\\]+/,
                    ""
                );


            const absolutePath =
                path.join(
                    process.cwd(),
                    relativePath
                );


            if (
                !fs.existsSync(
                    absolutePath
                )
            ) {

                console.warn(
                    "Quotation logo file not found:",
                    absolutePath
                );

                return null;

            }


            return fs.readFileSync(
                absolutePath
            );

        }

    } catch (error) {

        console.warn(
            "Unable to load quotation logo:",
            error.message
        );

    }


    return null;

};


// ======================================================
// GENERATE QUOTATION PDF
// ======================================================

const generateQuotationPdf = async (
    quotation
) => {

    return new Promise(
        async (resolve, reject) => {

            try {

                // ==========================================
                // SNAPSHOTS
                // ==========================================

                const company =
                    quotation.companySnapshot || {};

                const settings =
                    quotation.settingsSnapshot || {};


                const currency =
                    settings.currencyDisplay ||
                    "UGX";

                const dateFormat =
                    settings.dateFormat ||
                    "DD/MM/YYYY";


                // ==========================================
                // PDF DOCUMENT
                // ==========================================

                const doc =
                    new PDFDocument({

                        size: "A4",

                        margins: {
                            top: 45,
                            bottom: 45,
                            left: 45,
                            right: 45,
                        },

                        info: {

                            Title:
                                `Quotation ${quotation.quotationNumber}`,

                            Author:
                                company.companyName ||
                                "Concrete Finisher Uganda",

                            Subject:
                                "Official Quotation",

                        },

                    });


                const chunks = [];


                doc.on(
                    "data",
                    (chunk) => {
                        chunks.push(chunk);
                    }
                );


                doc.on(
                    "end",
                    () => {

                        resolve(
                            Buffer.concat(
                                chunks
                            )
                        );

                    }
                );


                doc.on(
                    "error",
                    reject
                );


                // ==========================================
                // COLORS
                // ==========================================

                const brown =
                    "#5A2E1B";

                const orange =
                    "#B8732E";

                const dark =
                    "#1F2D3D";

                const muted =
                    "#667085";

                const light =
                    "#F7F3EF";

                const border =
                    "#E5E0DA";


                // ==========================================
                // PAGE WIDTH
                // ==========================================

                const pageWidth =
                    doc.page.width -
                    doc.page.margins.left -
                    doc.page.margins.right;


                // ==========================================
                // HEADER
                // ==========================================

                const logo =
                    await loadLogo(
                        company.logo
                    );


                let headerY =
                    45;


                if (logo) {

                    try {

                        doc.image(
                            logo,
                            45,
                            headerY,
                            {
                                fit: [100, 55],
                            }
                        );

                    } catch (error) {

                        console.warn(
                            "Unable to render quotation logo:",
                            error.message
                        );

                    }

                }


                const companyX =
                    logo
                        ? 160
                        : 45;


                doc
                    .fillColor(dark)
                    .fontSize(18)
                    .font("Helvetica-Bold")
                    .text(

                        company.companyName ||
                        "Concrete Finisher Uganda",

                        companyX,
                        headerY

                    );


                doc
                    .fillColor(muted)
                    .fontSize(9)
                    .font("Helvetica")
                    .text(

                        company.physicalAddress ||
                        "",

                        companyX,
                        headerY + 25

                    );


                doc.text(

                    company.phoneNumber ||
                    "",

                    companyX,
                    headerY + 39

                );


                doc.text(

                    company.email ||
                    "",

                    companyX,
                    headerY + 53

                );


                if (company.website) {

                    doc.text(

                        company.website,

                        companyX,
                        headerY + 67

                    );

                }


                // ==========================================
                // QUOTATION TITLE
                // ==========================================

                doc
                    .fillColor(orange)
                    .fontSize(24)
                    .font("Helvetica-Bold")
                    .text(

                        "QUOTATION",

                        370,
                        headerY,

                        {
                            width: 180,
                            align: "right",
                        }

                    );


                doc
                    .fillColor(dark)
                    .fontSize(10)
                    .font("Helvetica-Bold")
                    .text(

                        quotation.quotationNumber,

                        370,
                        headerY + 34,

                        {
                            width: 180,
                            align: "right",
                        }

                    );


                doc
                    .font("Helvetica")
                    .fillColor(muted)
                    .fontSize(9)
                    .text(

                        `Date: ${formatDate(
                            quotation.quotationDate,
                            dateFormat
                        )}`,

                        370,
                        headerY + 50,

                        {
                            width: 180,
                            align: "right",
                        }

                    );


                doc.text(

                    `Valid Until: ${formatDate(
                        quotation.validUntil,
                        dateFormat
                    )}`,

                    370,
                    headerY + 64,

                    {
                        width: 180,
                        align: "right",
                    }

                );


                // ==========================================
                // HEADER DIVIDER
                // ==========================================

                doc
                    .moveTo(
                        45,
                        135
                    )
                    .lineTo(
                        45 + pageWidth,
                        135
                    )
                    .lineWidth(1)
                    .strokeColor(border)
                    .stroke();


                // ==========================================
                // CUSTOMER / PROJECT INFORMATION
                // ==========================================

                let infoY =
                    155;


                doc
                    .fillColor(light)
                    .roundedRect(
                        45,
                        infoY,
                        pageWidth,
                        105,
                        6
                    )
                    .fill();


                const columnGap =
                    25;

                const columnWidth =
                    (pageWidth - columnGap) / 2;


                // ------------------------------------------
                // CUSTOMER
                // ------------------------------------------

                doc
                    .fillColor(orange)
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .text(
                        "BILL TO",
                        60,
                        infoY + 15
                    );


                doc
                    .fillColor(dark)
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .text(

                        quotation.customer?.fullName ||
                        "",

                        60,
                        infoY + 34,

                        {
                            width: columnWidth,
                        }

                    );


                doc
                    .fillColor(muted)
                    .font("Helvetica")
                    .fontSize(9)
                    .text(

                        quotation.customer?.company ||
                        "",

                        60,
                        infoY + 49,

                        {
                            width: columnWidth,
                        }

                    );


                doc.text(

                    quotation.customer?.phoneNumber ||
                    "",

                    60,
                    infoY + 63,

                    {
                        width: columnWidth,
                    }

                );


                doc.text(

                    quotation.customer?.email ||
                    "",

                    60,
                    infoY + 77,

                    {
                        width: columnWidth,
                    }

                );


                // ------------------------------------------
                // PROJECT
                // ------------------------------------------

                const projectX =
                    60 +
                    columnWidth +
                    columnGap;


                doc
                    .fillColor(orange)
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .text(
                        "PROJECT",
                        projectX,
                        infoY + 15
                    );


                doc
                    .fillColor(dark)
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .text(

                        quotation.project?.projectName ||
                        "—",

                        projectX,
                        infoY + 34,

                        {
                            width: columnWidth,
                        }

                    );


                doc
                    .fillColor(muted)
                    .font("Helvetica")
                    .fontSize(9)
                    .text(

                        quotation.project?.projectLocation ||
                        "—",

                        projectX,
                        infoY + 50,

                        {
                            width: columnWidth,
                        }

                    );


                doc.text(

                    quotation.project?.projectDescription ||
                    "—",

                    projectX,
                    infoY + 66,

                    {
                        width: columnWidth,
                        height: 30,
                    }

                );


                // ==========================================
                // ITEMS TABLE
                // ==========================================

                let tableY =
                    infoY + 130;


                const descriptionWidth =
                    220;

                const quantityWidth =
                    55;

                const unitWidth =
                    60;

                const priceWidth =
                    90;

                const amountWidth =
                    pageWidth -
                    descriptionWidth -
                    quantityWidth -
                    unitWidth -
                    priceWidth;


                const tableX =
                    45;


                // ------------------------------------------
                // TABLE HEADER
                // ------------------------------------------

                doc
                    .fillColor(brown)
                    .rect(
                        tableX,
                        tableY,
                        pageWidth,
                        28
                    )
                    .fill();


                doc
                    .fillColor("#FFFFFF")
                    .font("Helvetica-Bold")
                    .fontSize(8);


                doc.text(
                    "DESCRIPTION",
                    tableX + 8,
                    tableY + 9,
                    {
                        width:
                            descriptionWidth - 16,
                    }
                );


                doc.text(
                    "QTY",
                    tableX +
                        descriptionWidth,
                    tableY + 9,
                    {
                        width:
                            quantityWidth,
                        align: "center",
                    }
                );


                doc.text(
                    "UNIT",
                    tableX +
                        descriptionWidth +
                        quantityWidth,
                    tableY + 9,
                    {
                        width:
                            unitWidth,
                        align: "center",
                    }
                );


                doc.text(
                    "UNIT PRICE",
                    tableX +
                        descriptionWidth +
                        quantityWidth +
                        unitWidth,
                    tableY + 9,
                    {
                        width:
                            priceWidth,
                        align: "right",
                    }
                );


                doc.text(
                    "AMOUNT",
                    tableX +
                        descriptionWidth +
                        quantityWidth +
                        unitWidth +
                        priceWidth,
                    tableY + 9,
                    {
                        width:
                            amountWidth - 8,
                        align: "right",
                    }
                );


                tableY += 28;


                // ------------------------------------------
                // TABLE ROWS
                // ------------------------------------------

                for (
                    const item
                    of quotation.items || []
                ) {

                    const rowHeight =
                        32;


                    doc
                        .fillColor("#FFFFFF")
                        .rect(
                            tableX,
                            tableY,
                            pageWidth,
                            rowHeight
                        )
                        .fill();


                    doc
                        .strokeColor(border)
                        .rect(
                            tableX,
                            tableY,
                            pageWidth,
                            rowHeight
                        )
                        .stroke();


                    doc
                        .fillColor(dark)
                        .font("Helvetica")
                        .fontSize(8);


                    doc.text(

                        item.description ||
                        "",

                        tableX + 8,
                        tableY + 10,

                        {
                            width:
                                descriptionWidth - 16,
                            height:
                                rowHeight - 8,
                        }

                    );


                    doc.text(

                        String(
                            item.quantity || 0
                        ),

                        tableX +
                            descriptionWidth,

                        tableY + 10,

                        {
                            width:
                                quantityWidth,
                            align:
                                "center",
                        }

                    );


                    doc.text(

                        item.unit ||
                        "",

                        tableX +
                            descriptionWidth +
                            quantityWidth,

                        tableY + 10,

                        {
                            width:
                                unitWidth,
                            align:
                                "center",
                        }

                    );


                    doc.text(

                        formatCurrency(
                            item.unitPrice,
                            currency
                        ),

                        tableX +
                            descriptionWidth +
                            quantityWidth +
                            unitWidth,

                        tableY + 10,

                        {
                            width:
                                priceWidth,
                            align:
                                "right",
                        }

                    );


                    doc.text(

                        formatCurrency(
                            item.amount,
                            currency
                        ),

                        tableX +
                            descriptionWidth +
                            quantityWidth +
                            unitWidth +
                            priceWidth,

                        tableY + 10,

                        {
                            width:
                                amountWidth - 8,
                            align:
                                "right",
                        }

                    );


                    tableY += rowHeight;


                    // --------------------------------------
                    // NEW PAGE IF NECESSARY
                    // --------------------------------------

                    if (
                        tableY >
                        doc.page.height - 120
                    ) {

                        doc.addPage();

                        tableY =
                            60;

                    }

                }


                // ==========================================
                // SUBTOTAL
                // ==========================================

                tableY += 12;


                const subtotalBoxX =
                    350;

                const subtotalBoxWidth =
                    pageWidth -
                    (subtotalBoxX - 45);


                doc
                    .fillColor(light)
                    .roundedRect(
                        subtotalBoxX,
                        tableY,
                        subtotalBoxWidth,
                        42,
                        5
                    )
                    .fill();


                doc
                    .fillColor(muted)
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .text(
                        "SUBTOTAL",
                        subtotalBoxX + 12,
                        tableY + 14
                    );


                doc
                    .fillColor(dark)
                    .font("Helvetica-Bold")
                    .fontSize(12)
                    .text(

                        formatCurrency(
                            quotation.subtotal,
                            currency
                        ),

                        subtotalBoxX,
                        tableY + 13,

                        {
                            width:
                                subtotalBoxWidth - 12,
                            align:
                                "right",
                        }

                    );


                // ==========================================
                // PAYMENT INFORMATION
                // ==========================================

                tableY += 70;


                doc
                    .fillColor(orange)
                    .font("Helvetica-Bold")
                    .fontSize(11)
                    .text(
                        "PAYMENT INFORMATION",
                        45,
                        tableY
                    );


                tableY += 20;


                doc
                    .fillColor(muted)
                    .font("Helvetica")
                    .fontSize(9);


                if (settings.bankName) {

                    doc.text(
                        `Bank: ${settings.bankName}`,
                        45,
                        tableY
                    );

                    tableY += 14;

                }


                if (settings.accountName) {

                    doc.text(
                        `Account Name: ${settings.accountName}`,
                        45,
                        tableY
                    );

                    tableY += 14;

                }


                if (settings.accountNumber) {

                    doc.text(
                        `Account Number: ${settings.accountNumber}`,
                        45,
                        tableY
                    );

                    tableY += 14;

                }


                if (
                    settings.mobileMoneyNumber ||
                    settings.mobileMoneyName
                ) {

                    doc.text(

                        `Mobile Money: ${
                            settings.mobileMoneyName || ""
                        } ${
                            settings.mobileMoneyNumber || ""
                        }`,

                        45,
                        tableY

                    );

                    tableY += 14;

                }


                // ==========================================
                // TERMS AND CONDITIONS
                // ==========================================

                tableY += 18;


                if (
                    settings.termsAndConditions
                ) {

                    doc
                        .fillColor(orange)
                        .font("Helvetica-Bold")
                        .fontSize(11)
                        .text(
                            "TERMS & CONDITIONS",
                            45,
                            tableY
                        );


                    tableY += 18;


                    doc
                        .fillColor(muted)
                        .font("Helvetica")
                        .fontSize(8.5)
                        .text(

                            settings.termsAndConditions,

                            45,
                            tableY,

                            {
                                width:
                                    pageWidth,
                                lineGap:
                                    3,
                            }

                        );

                }


                // ==========================================
                // FOOTER
                // ==========================================

                const footerY =
                    doc.page.height -
                    55;


                doc
                    .moveTo(
                        45,
                        footerY - 10
                    )
                    .lineTo(
                        45 + pageWidth,
                        footerY - 10
                    )
                    .lineWidth(0.5)
                    .strokeColor(border)
                    .stroke();


                doc
                    .fillColor(muted)
                    .font("Helvetica")
                    .fontSize(8)
                    .text(

                        settings.footerMessage ||
                        "Thank you for your business.",

                        45,
                        footerY,

                        {
                            width:
                                pageWidth,
                            align:
                                "center",
                        }

                    );


                // ==========================================
                // FINISH PDF
                // ==========================================

                doc.end();

            } catch (error) {

                reject(error);

            }

        }
    );

};


// ======================================================
// EXPORT
// ======================================================

export default generateQuotationPdf;