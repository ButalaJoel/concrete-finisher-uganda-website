import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
  },

  company: {
    type: String,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  email: {
    type: String,
  },

  serviceRequired: {
    type: String,
    required: true,
  },

  propertyType: {
    type: String,
    required: true,
  },

  projectLocation: {
    type: String,
    required: true,
  },

  estimatedArea: {
    type: String,
  },

  preferredStartDate: {
    type: Date,
  },

  projectDescription: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "New",
  },

}, {
  timestamps: true,
});

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;