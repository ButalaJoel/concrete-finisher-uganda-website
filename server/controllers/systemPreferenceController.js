// ======================================================
// FILE: systemPreferenceController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles System Preferences API operations.
//
// RESPONSIBILITIES:
// • Get saved system preferences
// • Create the first preferences record
// • Update existing preferences
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORT SYSTEM PREFERENCE MODEL
// ======================================================

import SystemPreference
    from "../models/SystemPreference.js";


// ======================================================
// GET SYSTEM PREFERENCES
//
// ROUTE:
//
// GET /api/preferences
//
// PURPOSE:
//
// Returns the saved system preferences.
//
// If preferences have never been created,
// default preferences are returned.
// ======================================================

const getSystemPreferences =
    async (req, res) => {

        try {

            // ==============================================
            // FIND EXISTING PREFERENCES
            // ==============================================

            let preferences =
                await SystemPreference.findOne();


            // ==============================================
            // CREATE DEFAULT PREFERENCES IF NONE EXIST
            //
            // This ensures the system always has
            // preferences available.
            // ==============================================

            if (!preferences) {

                preferences =
                    await SystemPreference.create({});

            }


            // ==============================================
            // SUCCESS RESPONSE
            // ==============================================

            res.status(200).json(
                preferences
            );

        } catch (error) {

            console.error(
                "Get system preferences error:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to load system preferences.",

            });

        }

    };


// ======================================================
// UPDATE SYSTEM PREFERENCES
//
// ROUTE:
//
// PUT /api/preferences
//
// PURPOSE:
//
// Updates the saved system preferences.
// ======================================================

const updateSystemPreferences =
    async (req, res) => {

        try {

            // ==============================================
            // GET REQUEST DATA
            // ==============================================

            const {

                currency,

                currencyDisplay,

                timezone,

                dateFormat,

                quotationPrefix,

                defaultValidity,

            } = req.body;


            // ==============================================
            // FIND EXISTING PREFERENCES
            // ==============================================

            let preferences =
                await SystemPreference.findOne();


            // ==============================================
            // CREATE PREFERENCES IF NONE EXIST
            // ==============================================

            if (!preferences) {

                preferences =
                    new SystemPreference({});

            }


            // ==============================================
            // UPDATE CURRENCY
            // ==============================================

            if (currency !== undefined) {

                preferences.currency =
                    currency;

            }


            // ==============================================
            // UPDATE CURRENCY DISPLAY
            // ==============================================

            if (currencyDisplay !== undefined) {

                preferences.currencyDisplay =
                    currencyDisplay;

            }


            // ==============================================
            // UPDATE TIMEZONE
            // ==============================================

            if (timezone !== undefined) {

                preferences.timezone =
                    timezone;

            }


            // ==============================================
            // UPDATE DATE FORMAT
            // ==============================================

            if (dateFormat !== undefined) {

                preferences.dateFormat =
                    dateFormat;

            }


            // ==============================================
            // UPDATE QUOTATION PREFIX
            // ==============================================

            if (quotationPrefix !== undefined) {

                preferences.quotationPrefix =
                    quotationPrefix;

            }


            // ==============================================
            // UPDATE DEFAULT VALIDITY
            // ==============================================

            if (defaultValidity !== undefined) {

                preferences.defaultValidity =
                    defaultValidity;

            }


            // ==============================================
            // SAVE PREFERENCES
            // ==============================================

            const savedPreferences =
                await preferences.save();


            // ==============================================
            // SUCCESS RESPONSE
            // ==============================================

            res.status(200).json({

                message:
                    "System preferences saved successfully.",

                preferences:
                    savedPreferences,

            });

        } catch (error) {

            console.error(
                "Update system preferences error:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to save system preferences.",

            });

        }

    };


// ======================================================
// EXPORT CONTROLLER FUNCTIONS
// ======================================================

export {

    getSystemPreferences,

    updateSystemPreferences,

};