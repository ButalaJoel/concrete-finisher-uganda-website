import mongoose from "mongoose";

const quotationCounterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        required: true,
        min: 0,
    },
});

const QuotationCounter = mongoose.model(
    "QuotationCounter",
    quotationCounterSchema
);

export default QuotationCounter;
