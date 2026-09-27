// ======================================================
// FILE: quotationSettingController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles quotation settings used when generating
// official customer quotations.
//
// AUTHOR:
// Joel Butala
// ======================================================

import QuotationSetting
    from "../models/QuotationSetting.js";


// ======================================================
// GET QUOTATION SETTINGS
//
// GET /api/quotation-settings
// ======================================================

const getQuotationSettings = async (req, res) => {

    try {

        let settings =
            await QuotationSetting.findOne();


        // ==============================================
        // CREATE DEFAULT RECORD IF NONE EXISTS
        // ==============================================

        if (!settings) {

            settings =
                await QuotationSetting.create({});

        }


        // ==============================================
        // SUCCESS
        // ==============================================

        res.status(200).json({

            settings,

        });

    } catch (error) {

        console.error(
            "Get quotation settings error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to load quotation settings.",

        });

    }

};


// ======================================================
// UPDATE QUOTATION SETTINGS
//
// PUT /api/quotation-settings
// ======================================================

const updateQuotationSettings = async (req, res) => {

    try {

        const {

            bankName,

            accountName,

            accountNumber,

            mobileMoneyNumber,

            mobileMoneyName,

            termsAndConditions,

            footerMessage,

        } = req.body;


        // ==============================================
        // FIND EXISTING SETTINGS
        // ==============================================

        let settings =
            await QuotationSetting.findOne();


        // ==============================================
        // CREATE IF NONE EXISTS
        // ==============================================

        if (!settings) {

            settings =
                new QuotationSetting({});

        }


        // ==============================================
        // UPDATE VALUES
        // ==============================================

        if (bankName !== undefined) {

            settings.bankName =
                bankName;

        }


        if (accountName !== undefined) {

            settings.accountName =
                accountName;

        }


        if (accountNumber !== undefined) {

            settings.accountNumber =
                accountNumber;

        }


        if (mobileMoneyNumber !== undefined) {

            settings.mobileMoneyNumber =
                mobileMoneyNumber;

        }


        if (mobileMoneyName !== undefined) {

            settings.mobileMoneyName =
                mobileMoneyName;

        }


        if (termsAndConditions !== undefined) {

            settings.termsAndConditions =
                termsAndConditions;

        }


        if (footerMessage !== undefined) {

            settings.footerMessage =
                footerMessage;

        }


        // ==============================================
        // SAVE
        // ==============================================

        const savedSettings =
            await settings.save();


        // ==============================================
        // SUCCESS
        // ==============================================

        res.status(200).json({

            message:
                "Quotation settings saved successfully.",

            settings:
                savedSettings,

        });

    } catch (error) {

        console.error(
            "Update quotation settings error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to save quotation settings.",

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

export {

    getQuotationSettings,

    updateQuotationSettings,

};