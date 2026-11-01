import mongoose from "mongoose";
import { createHash } from "crypto";
import Company from "../models/Company.js";
import OfficialQuotation from "../models/OfficialQuotation.js";
import PaymentReceipt from "../models/PaymentReceipt.js";
import ReceiptCounter from "../models/ReceiptCounter.js";
import SystemPreference from "../models/SystemPreference.js";
import buildPaymentReceiptPdf from "../utils/paymentReceiptPdfGenerator.js";

const RECEIPT_PREFIX = "CFU-RC";
const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Mobile Money", "Cheque", "Other"];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const getIdempotencyKey = (req) => {
    const headerKey = req.get("Idempotency-Key");
    const suppliedKey = headerKey ?? req.body?.idempotencyKey;

    if (suppliedKey === undefined || suppliedKey === null || suppliedKey === "") {
        return null;
    }

    if (
        typeof suppliedKey !== "string" ||
        !/^[A-Za-z0-9._:-]{8,128}$/.test(suppliedKey.trim())
    ) {
        return false;
    }

    return suppliedKey.trim();
};

const respondWithExistingReceipt = async (res, key, fingerprint) => {
    const existing = await PaymentReceipt.findOne({ idempotencyKey: key })
        .select("+requestFingerprint")
        .lean();

    if (!existing) {
        return false;
    }

    if (existing.requestFingerprint !== fingerprint) {
        res.status(409).json({
            success: false,
            message: "This idempotency key was already used for a different payment.",
        });
        return true;
    }

    delete existing.requestFingerprint;
    delete existing.idempotencyKey;
    res.status(200).json({
        success: true,
        message: "This payment receipt was already created.",
        data: existing,
    });
    return true;
};

const getNextReceiptNumber = async () => {
    const existingCounter = await ReceiptCounter.findById(RECEIPT_PREFIX).lean();

    if (!existingCounter) {
        const existingReceipts = await PaymentReceipt.find({
            receiptNumber: { $regex: `^${escapeRegex(RECEIPT_PREFIX)}-\\d+$` },
        })
            .select("receiptNumber")
            .lean();
        const highestSequence = existingReceipts.reduce((highest, receipt) => {
            const match = receipt.receiptNumber.match(/-(\d+)$/);
            const sequence = match ? Number(match[1]) : 0;
            return Number.isSafeInteger(sequence)
                ? Math.max(highest, sequence)
                : highest;
        }, 0);

        try {
            await ReceiptCounter.create({
                _id: RECEIPT_PREFIX,
                sequence: highestSequence,
            });
        } catch (error) {
            if (error.code !== 11000) {
                throw error;
            }
        }
    }

    const counter = await ReceiptCounter.findOneAndUpdate(
        { _id: RECEIPT_PREFIX },
        { $inc: { sequence: 1 } },
        { returnDocument: "after", runValidators: true }
    );

    if (!counter || !Number.isSafeInteger(counter.sequence)) {
        throw new Error("Unable to allocate a payment receipt number.");
    }

    return `${RECEIPT_PREFIX}-${String(counter.sequence).padStart(3, "0")}`;
};

const createPaymentReceipt = async (req, res) => {
    let idempotencyKey = null;
    let requestFingerprint = null;

    try {
        const {
            paymentDate,
            customer,
            projectDescription,
            relatedQuotation,
            amountReceived,
            paymentMethod,
            transactionReference,
            receivedBy,
            notes,
        } = req.body;

        const parsedAmount =
            (typeof amountReceived !== "number" &&
                typeof amountReceived !== "string") ||
            (typeof amountReceived === "string" && !amountReceived.trim())
                ? NaN
                : Number(amountReceived);
        const parsedDate =
            typeof paymentDate === "string" && paymentDate
                ? new Date(paymentDate)
                : new Date(NaN);

        if (
            !hasText(customer?.fullName) ||
            !hasText(customer?.phoneNumber) ||
            !hasText(projectDescription) ||
            !hasText(receivedBy)
        ) {
            return res.status(400).json({
                success: false,
                message: "Customer name, phone, project description, and received-by name are required.",
            });
        }

        if (
            hasText(customer.email) &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid customer email address.",
            });
        }

        if (
            !Number.isFinite(parsedAmount) ||
            parsedAmount <= 0 ||
            Math.round(parsedAmount * 100) / 100 !== parsedAmount
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount received must be positive and may have no more than two decimal places.",
            });
        }

        if (
            typeof paymentDate !== "string" ||
            !paymentDate ||
            Number.isNaN(parsedDate.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid payment date is required.",
            });
        }

        idempotencyKey = getIdempotencyKey(req);
        if (idempotencyKey === false) {
            return res.status(400).json({
                success: false,
                message: "Idempotency-Key must be 8–128 letters, numbers, or . _ : - characters.",
            });
        }

        const normalizedRequest = {
            paymentDate: parsedDate.toISOString(),
            customer: {
                fullName: customer.fullName.trim(),
                phoneNumber: customer.phoneNumber.trim(),
                email: hasText(customer.email) ? customer.email.trim() : "",
            },
            projectDescription: projectDescription.trim(),
            relatedQuotation: relatedQuotation || null,
            amountReceived: parsedAmount,
            paymentMethod,
            transactionReference: hasText(transactionReference)
                ? transactionReference.trim()
                : "",
            receivedBy: receivedBy.trim(),
            notes: hasText(notes) ? notes.trim() : "",
        };
        requestFingerprint = createHash("sha256")
            .update(JSON.stringify(normalizedRequest))
            .digest("hex");

        if (
            idempotencyKey &&
            await respondWithExistingReceipt(
                res,
                idempotencyKey,
                requestFingerprint
            )
        ) {
            return;
        }

        if (!PAYMENT_METHODS.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Select a valid payment method.",
            });
        }

        let quotation = null;
        if (relatedQuotation) {
            if (!mongoose.isValidObjectId(relatedQuotation)) {
                return res.status(400).json({
                    success: false,
                    message: "The selected quotation is invalid.",
                });
            }

            quotation = await OfficialQuotation.findById(relatedQuotation)
                .select("quotationNumber")
                .lean();

            if (!quotation) {
                return res.status(404).json({
                    success: false,
                    message: "The selected quotation could not be found.",
                });
            }
        }

        const [company, preferences] = await Promise.all([
            Company.findOne().lean(),
            SystemPreference.findOne().lean(),
        ]);

        const receipt = await PaymentReceipt.create({
            receiptNumber: await getNextReceiptNumber(),
            ...(idempotencyKey
                ? { idempotencyKey, requestFingerprint }
                : {}),
            paymentDate: parsedDate,
            customer: {
                fullName: customer.fullName.trim(),
                phoneNumber: customer.phoneNumber.trim(),
                email: hasText(customer.email) ? customer.email.trim() : "",
            },
            projectDescription: projectDescription.trim(),
            relatedQuotation: quotation?._id || null,
            quotationNumber: quotation?.quotationNumber || "",
            amountReceived: parsedAmount,
            paymentMethod,
            transactionReference: hasText(transactionReference) ? transactionReference.trim() : "",
            receivedBy: receivedBy.trim(),
            notes: hasText(notes) ? notes.trim() : "",
            companySnapshot: {
                companyName: company?.companyName || "Concrete Finisher Uganda",
                email: company?.email || "",
                phoneNumber: company?.phoneNumber || "",
                whatsappNumber: company?.whatsappNumber || "",
                physicalAddress: company?.physicalAddress || "",
                website: company?.website || "",
                logo: company?.logo || "",
            },
            dateFormat: preferences?.dateFormat || "DD/MM/YYYY",
            createdBy: req.admin._id,
        });

        const responseReceipt = receipt.toObject();
        delete responseReceipt.idempotencyKey;
        delete responseReceipt.requestFingerprint;

        return res.status(201).json({
            success: true,
            message: "Payment receipt created successfully.",
            data: responseReceipt,
        });
    } catch (error) {
        if (
            error.code === 11000 &&
            error.keyPattern?.idempotencyKey &&
            idempotencyKey &&
            requestFingerprint
        ) {
            try {
                const handled = await respondWithExistingReceipt(
                    res,
                    idempotencyKey,
                    requestFingerprint
                );
                if (handled) {
                    return;
                }
            } catch (retryError) {
                console.error("Unable to resolve duplicate receipt submission:", retryError);
            }
        }

        if (error.code === 11000 && error.keyPattern?.receiptNumber) {
            console.error("Duplicate payment receipt number:", error);
            return res.status(409).json({
                success: false,
                message: "A receipt number conflict occurred. Please try again.",
            });
        }

        console.error("Create payment receipt error:", error);
        return res.status(
            error.name === "ValidationError" || error.name === "CastError" ? 400 : 500
        ).json({
            success: false,
            message: "Unable to create payment receipt.",
        });
    }
};

const getPaymentReceipts = async (req, res) => {
    try {
        const { search = "", paymentMethod, status, dateFrom, dateTo } = req.query;
        const filter = {};

        const searchText = typeof search === "string" ? search.trim() : "";
        if (searchText) {
            const expression = new RegExp(escapeRegex(searchText), "i");
            filter.$or = [
                { receiptNumber: expression },
                { "customer.fullName": expression },
                { "customer.phoneNumber": expression },
                { projectDescription: expression },
                { quotationNumber: expression },
                { transactionReference: expression },
            ];
        }

        if (PAYMENT_METHODS.includes(paymentMethod)) {
            filter.paymentMethod = paymentMethod;
        }

        if (["Issued", "Voided"].includes(status)) {
            filter.status = status;
        }

        if (dateFrom || dateTo) {
            filter.paymentDate = {};
            if (dateFrom && !Number.isNaN(new Date(dateFrom).getTime())) {
                filter.paymentDate.$gte = new Date(dateFrom);
            }
            if (dateTo && !Number.isNaN(new Date(dateTo).getTime())) {
                const endDate = new Date(dateTo);
                endDate.setUTCHours(23, 59, 59, 999);
                filter.paymentDate.$lte = endDate;
            }
            if (!Object.keys(filter.paymentDate).length) {
                delete filter.paymentDate;
            }
        }

        const receipts = await PaymentReceipt.find(filter)
            .sort({ paymentDate: -1, createdAt: -1 })
            .lean();

        return res.status(200).json({ success: true, data: receipts });
    } catch (error) {
        console.error("Get payment receipts error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve payment receipts.",
        });
    }
};

const getPaymentReceipt = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid receipt identifier.",
            });
        }

        const receipt = await PaymentReceipt.findById(req.params.id).lean();
        if (!receipt) {
            return res.status(404).json({
                success: false,
                message: "Payment receipt not found.",
            });
        }

        return res.status(200).json({ success: true, data: receipt });
    } catch (error) {
        console.error("Get payment receipt error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve payment receipt.",
        });
    }
};

const voidPaymentReceipt = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid receipt identifier.",
            });
        }

        const receipt = await PaymentReceipt.findOneAndUpdate(
            { _id: req.params.id, status: "Issued" },
            {
                $set: {
                    status: "Voided",
                    voidedAt: new Date(),
                    voidedBy: req.admin._id,
                },
            },
            { returnDocument: "after", runValidators: true }
        );

        if (!receipt) {
            const existingReceipt = await PaymentReceipt.findById(req.params.id)
                .select("status")
                .lean();
            if (existingReceipt?.status === "Voided") {
                return res.status(409).json({
                    success: false,
                    message: "This receipt has already been voided.",
                });
            }

            return res.status(404).json({
                success: false,
                message: "Payment receipt not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment receipt voided successfully.",
            data: receipt,
        });
    } catch (error) {
        console.error("Void payment receipt error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to void payment receipt.",
        });
    }
};

const generatePaymentReceiptPdf = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid receipt identifier.",
            });
        }

        const receipt = await PaymentReceipt.findById(req.params.id).lean();
        if (!receipt) {
            return res.status(404).json({
                success: false,
                message: "Payment receipt not found.",
            });
        }

        const pdfBuffer = await buildPaymentReceiptPdf(receipt);
        const disposition = req.query.download === "true" ? "attachment" : "inline";

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `${disposition}; filename="${receipt.receiptNumber}.pdf"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);

        return res.send(pdfBuffer);
    } catch (error) {
        console.error("Generate payment receipt PDF error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to generate payment receipt PDF.",
        });
    }
};

export {
    createPaymentReceipt,
    generatePaymentReceiptPdf,
    getPaymentReceipt,
    getPaymentReceipts,
    voidPaymentReceipt,
};
