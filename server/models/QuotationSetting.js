// ======================================================
// FILE: QuotationSetting.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Stores default information used when generating
// official customer quotations.
//
// AUTHOR:
// Joel Butala
// ======================================================

import mongoose from "mongoose";


// ======================================================
// QUOTATION SETTING SCHEMA
// ======================================================

const quotationSettingSchema = new mongoose.Schema(

    {

        // ==================================================
        // BANK PAYMENT INFORMATION
        // ==================================================

        bankName: {

            type: String,

            default: "",

            trim: true,

        },


        accountName: {

            type: String,

            default: "",

            trim: true,

        },


        accountNumber: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // MOBILE MONEY INFORMATION
        // ==================================================

        mobileMoneyNumber: {

            type: String,

            default: "",

            trim: true,

        },


        mobileMoneyName: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // TERMS & CONDITIONS
        // ==================================================

        termsAndConditions: {

            type: String,

            default: "",

            trim: true,

        },


        // ==================================================
        // QUOTATION FOOTER
        // ==================================================

        footerMessage: {

            type: String,

            default: "",

            trim: true,

        },

    },

    {

        timestamps: true,

    }

);


// ======================================================
// CREATE MODEL
// ======================================================

const QuotationSetting = mongoose.model(

    "QuotationSetting",

    quotationSettingSchema

);


// ======================================================
// EXPORT MODEL
// ======================================================

export default QuotationSetting;