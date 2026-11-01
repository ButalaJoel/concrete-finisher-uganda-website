import mongoose from "mongoose";

const paymentReceiptSchema = new mongoose.Schema(
    {
        receiptNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        idempotencyKey: {
            type: String,
            trim: true,
            maxlength: 128,
            select: false,
        },
        requestFingerprint: {
            type: String,
            trim: true,
            select: false,
        },
        paymentDate: {
            type: Date,
            required: true,
        },
        customer: {
            fullName: {
                type: String,
                required: true,
                trim: true,
                maxlength: 160,
            },
            phoneNumber: {
                type: String,
                required: true,
                trim: true,
                maxlength: 50,
            },
            email: {
                type: String,
                default: "",
                trim: true,
                maxlength: 160,
            },
        },
        projectDescription: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        relatedQuotation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OfficialQuotation",
            default: null,
        },
        quotationNumber: {
            type: String,
            default: "",
            trim: true,
            maxlength: 120,
        },
        amountReceived: {
            type: Number,
            required: true,
            min: [0.01, "Amount received must be greater than zero."],
            validate: {
                validator: (amount) =>
                    Number.isFinite(amount) &&
                    Math.round(amount * 100) / 100 === amount,
                message: "Amount received may have no more than two decimal places.",
            },
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["Cash", "Bank Transfer", "Mobile Money", "Cheque", "Other"],
        },
        transactionReference: {
            type: String,
            default: "",
            trim: true,
            maxlength: 120,
        },
        receivedBy: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        notes: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ["Issued", "Voided"],
            default: "Issued",
        },
        voidedAt: {
            type: Date,
            default: null,
        },
        voidedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },
        companySnapshot: {
            companyName: { type: String, default: "" },
            email: { type: String, default: "" },
            phoneNumber: { type: String, default: "" },
            whatsappNumber: { type: String, default: "" },
            physicalAddress: { type: String, default: "" },
            website: { type: String, default: "" },
            logo: { type: String, default: "" },
        },
        dateFormat: {
            type: String,
            default: "DD/MM/YYYY",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

paymentReceiptSchema.index({ createdAt: -1 });
paymentReceiptSchema.index({ paymentDate: -1 });
paymentReceiptSchema.index({ paymentMethod: 1 });
paymentReceiptSchema.index(
    { idempotencyKey: 1 },
    {
        unique: true,
        partialFilterExpression: { idempotencyKey: { $type: "string" } },
    }
);

const PaymentReceipt = mongoose.model("PaymentReceipt", paymentReceiptSchema);

export default PaymentReceipt;
