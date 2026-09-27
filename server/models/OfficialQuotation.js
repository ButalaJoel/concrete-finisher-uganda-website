// ======================================================
// FILE: OfficialQuotation.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Stores official quotations created by administrators.
// ======================================================

import mongoose from "mongoose";


// ======================================================
// QUOTATION ITEM SCHEMA
// ======================================================

const quotationItemSchema = new mongoose.Schema({

    description: {

        type: String,

        required: true,

        trim: true,

    },

    quantity: {

        type: Number,

        required: true,

        min: 0,

    },

    unit: {

        type: String,

        required: true,

        trim: true,

    },

    unitPrice: {

        type: Number,

        required: true,

        min: 0,

    },

    amount: {

        type: Number,

        required: true,

        min: 0,

    },

}, {
    _id: true,
});


// ======================================================
// OFFICIAL QUOTATION SCHEMA
// ======================================================

const officialQuotationSchema = new mongoose.Schema({

    // ==================================================
    // QUOTATION IDENTIFICATION
    // ==================================================

    quotationNumber: {

        type: String,

        required: true,

        unique: true,

        trim: true,

    },

    quotationDate: {

        type: Date,

        required: true,

    },

    validUntil: {

        type: Date,

        required: true,

    },


    // ==================================================
    // CUSTOMER DETAILS
    // ==================================================

    customer: {

        fullName: {

            type: String,

            required: true,

            trim: true,

        },

        company: {

            type: String,

            default: "",

            trim: true,

        },

        phoneNumber: {

            type: String,

            required: true,

            trim: true,

        },

        email: {

            type: String,

            default: "",

            trim: true,

        },

        address: {

            type: String,

            default: "",

            trim: true,

        },

    },


    // ==================================================
    // PROJECT DETAILS
    // ==================================================

    project: {

        projectName: {

            type: String,

            default: "",

            trim: true,

        },

        projectLocation: {

            type: String,

            default: "",

            trim: true,

        },

        projectDescription: {

            type: String,

            default: "",

            trim: true,

        },

    },


    // ==================================================
    // QUOTATION ITEMS
    // ==================================================

    items: {

        type: [quotationItemSchema],

        required: true,

        validate: {

            validator: function (items) {

                return items.length > 0;

            },

            message:
                "A quotation must contain at least one item.",

        },

    },


    // ==================================================
    // SUBTOTAL
    // ==================================================

    subtotal: {

        type: Number,

        required: true,

        min: 0,

    },


    // ==================================================
    // COMPANY SNAPSHOT
    //
    // Stores the company information exactly as it
    // existed when this quotation was created.
    //
    // This protects old quotations from future changes
    // to the Company Profile.
    // ==================================================

    companySnapshot: {

        companyName: {

            type: String,

            default: "",

        },

        email: {

            type: String,

            default: "",

        },

        phoneNumber: {

            type: String,

            default: "",

        },

        whatsappNumber: {

            type: String,

            default: "",

        },

        physicalAddress: {

            type: String,

            default: "",

        },

        website: {

            type: String,

            default: "",

        },

        logo: {

            type: String,

            default: "",

        },

    },


    // ==================================================
    // SETTINGS SNAPSHOT
    //
    // Stores the quotation/system settings at the
    // moment the quotation was created.
    // ==================================================

    settingsSnapshot: {

        currency: {

            type: String,

            default:
                "Ugandan Shilling (UGX)",

        },

        currencyDisplay: {

            type: String,

            default: "UGX",

        },

        dateFormat: {

            type: String,

            default: "DD/MM/YYYY",

        },

        timezone: {

            type: String,

            default: "Africa/Kampala",

        },

        quotationPrefix: {

            type: String,

            default: "CFU-QT",

        },

        defaultValidity: {

            type: Number,

            default: 30,

        },

        bankName: {

            type: String,

            default: "",

        },

        accountName: {

            type: String,

            default: "",

        },

        accountNumber: {

            type: String,

            default: "",

        },

        mobileMoneyNumber: {

            type: String,

            default: "",

        },

        mobileMoneyName: {

            type: String,

            default: "",

        },

        termsAndConditions: {

            type: String,

            default: "",

        },

        footerMessage: {

            type: String,

            default: "",

        },

    },


    // ==================================================
    // STATUS
    // ==================================================

    status: {

        type: String,

        enum: [

            "Draft",

            "Issued",

            "Accepted",

            "Rejected",

            "Expired",

        ],

        default: "Draft",

    },


    // ==================================================
    // ADMIN WHO CREATED THE QUOTATION
    // ==================================================

    createdBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Admin",

        required: true,

    },

}, {

    timestamps: true,

});


// ======================================================
// CREATE MODEL
// ======================================================

const OfficialQuotation = mongoose.model(

    "OfficialQuotation",

    officialQuotationSchema

);


// ======================================================
// EXPORT
// ======================================================

export default OfficialQuotation;