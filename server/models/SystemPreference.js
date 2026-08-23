// ======================================================
// FILE: SystemPreference.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines the database structure for system preferences.
//
// RESPONSIBILITIES:
// • Store currency settings
// • Store currency display format
// • Store timezone settings
// • Store date format
// • Store quotation number prefix
// • Store default quotation validity
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORT MONGOOSE
// ======================================================

import mongoose from "mongoose";


// ======================================================
// SYSTEM PREFERENCE SCHEMA
// ======================================================

const systemPreferenceSchema =
    new mongoose.Schema(

        {

            // ==================================================
            // CURRENCY
            //
            // Example:
            //
            // Ugandan Shilling (UGX)
            // ==================================================

            currency: {

                type: String,

                default:
                    "Ugandan Shilling (UGX)",

            },


            // ==================================================
            // CURRENCY DISPLAY
            //
            // Example:
            //
            // UGX
            // ==================================================

            currencyDisplay: {

                type: String,

                default:
                    "UGX",

            },


            // ==================================================
            // TIMEZONE
            //
            // Example:
            //
            // Africa/Kampala
            // ==================================================

            timezone: {

                type: String,

                default:
                    "Africa/Kampala",

            },


            // ==================================================
            // DATE FORMAT
            //
            // Example:
            //
            // DD/MM/YYYY
            // ==================================================

            dateFormat: {

                type: String,

                default:
                    "DD/MM/YYYY",

            },


            // ==================================================
            // QUOTATION NUMBER PREFIX
            //
            // Example:
            //
            // CFU-QT
            //
            // Future quotation numbers can become:
            //
            // CFU-QT-0001
            // CFU-QT-0002
            // ==================================================

            quotationPrefix: {

                type: String,

                default:
                    "CFU-QT",

            },


            // ==================================================
            // DEFAULT QUOTATION VALIDITY
            //
            // Number of days a quotation remains valid.
            //
            // Example:
            //
            // 30
            // ==================================================

            defaultValidity: {

                type: Number,

                default:
                    30,

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

const SystemPreference =
    mongoose.model(

        "SystemPreference",

        systemPreferenceSchema

    );


// ======================================================
// EXPORT MODEL
// ======================================================

export default SystemPreference;