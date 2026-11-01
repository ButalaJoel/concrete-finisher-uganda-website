import mongoose from "mongoose";

const receiptCounterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isSafeInteger,
            message: "Receipt counter sequence must be a safe integer.",
        },
    },
});

const ReceiptCounter = mongoose.model("ReceiptCounter", receiptCounterSchema);

export default ReceiptCounter;
