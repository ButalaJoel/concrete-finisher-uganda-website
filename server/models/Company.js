// ======================================================
// FILE: Company.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines the Company Profile database model.
//
// RESPONSIBILITIES:
// • Store company information
// • Store company logo
// • Provide reusable business details for future
//   quotations, invoices and other documents
//
// AUTHOR:
// Joel Butala
// ======================================================

// ======================================================
// IMPORT MONGOOSE
// ======================================================

import mongoose from "mongoose";

// ======================================================
// COMPANY SCHEMA
// ======================================================

const companySchema = new mongoose.Schema(

    {

        // ==================================================
        // COMPANY NAME
        // ==================================================

        companyName: {

            type: String,

            required: true,

            trim: true,

        },


        // ==================================================
        // COMPANY EMAIL
        // ==================================================

        email: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // PHONE NUMBER
        // ==================================================

        phoneNumber: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // WHATSAPP NUMBER
        // ==================================================

        whatsappNumber: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // PHYSICAL ADDRESS
        // ==================================================

        physicalAddress: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // WEBSITE
        // ==================================================

        website: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // COMPANY DESCRIPTION
        // ==================================================

        description: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // COMPANY LOGO
        //
        // Stores the relative path, for example:
        //
        // /uploads/company/logo-123456.png
        // ==================================================

        logo: {

            type: String,

            default: "",

        },

    },

    {

        // Automatically adds:
        //
        // createdAt
        // updatedAt

        timestamps: true,

    }

);

// ======================================================
// CREATE MODEL
// ======================================================

const Company = mongoose.model(

    "Company",

    companySchema

);

// ======================================================
// EXPORT MODEL
// ======================================================

export default Company;