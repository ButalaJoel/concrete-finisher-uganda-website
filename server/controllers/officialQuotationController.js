// ======================================================
// FILE: officialQuotationController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles official quotation creation and management.
//
// RESPONSIBILITIES:
// • Generate quotation numbers automatically
// • Load company profile
// • Load system preferences
// • Load quotation settings
// • Calculate quotation totals
// • Save company/settings snapshots
// • Create official quotations
// • Retrieve official quotations
// • Retrieve a single official quotation
// • Update official quotations
// • Delete official quotations
// ======================================================


// ======================================================
// IMPORT MODELS
// ======================================================

import OfficialQuotation
    from "../models/OfficialQuotation.js";

import SystemPreference
    from "../models/SystemPreference.js";

import QuotationSetting
    from "../models/QuotationSetting.js";

import Company
    from "../models/Company.js";

import generateQuotationPdf
    from "../utils/quotationPdfGenerator.js";    


// ======================================================
// GENERATE NEXT QUOTATION NUMBER
//
// Example:
//
// CFU-QT-001
// CFU-QT-002
// CFU-QT-003
//
// The system looks for the highest existing quotation
// number and increases it by one.
//
// Deleted quotations therefore do not cause old numbers
// to be reused.
// ======================================================

const generateQuotationNumber = async (prefix) => {

    // --------------------------------------------------
    // NORMALISE PREFIX
    // --------------------------------------------------

    const cleanPrefix =
        String(prefix || "CFU-QT")
            .trim()
            .toUpperCase();


    // --------------------------------------------------
    // FIND QUOTATIONS USING THIS PREFIX
    // --------------------------------------------------

    const quotations =
        await OfficialQuotation.find({

            quotationNumber: {

                $regex:
                    `^${cleanPrefix}-`,

                $options: "i",

            },

        })
        .select("quotationNumber")
        .lean();


    // --------------------------------------------------
    // FIND HIGHEST NUMBER
    // --------------------------------------------------

    let highestNumber = 0;


    for (const quotation of quotations) {

        const match =
            quotation.quotationNumber.match(
                /-(\d+)$/
            );


        if (!match) {

            continue;

        }


        const number =
            Number(match[1]);


        if (number > highestNumber) {

            highestNumber = number;

        }

    }


    // --------------------------------------------------
    // INCREASE NUMBER
    // --------------------------------------------------

    const nextNumber =
        highestNumber + 1;


    // --------------------------------------------------
    // PAD WITH ZEROS
    //
    // 1    → 001
    // 12   → 012
    // 123  → 123
    // 1000 → 1000
    // --------------------------------------------------

    const formattedNumber =
        String(nextNumber).padStart(3, "0");


    return `${cleanPrefix}-${formattedNumber}`;

};


// ======================================================
// CREATE OFFICIAL QUOTATION
//
// POST:
// /api/official-quotations
// ======================================================

const createOfficialQuotation =
    async (req, res) => {

        try {

            // ==============================================
            // GET REQUEST DATA
            // ==============================================

            const {

                quotationDate,

                validUntil,

                customer,

                project,

                items,

            } = req.body;


            // ==============================================
            // VALIDATE CUSTOMER
            // ==============================================

            if (
                !customer ||
                !customer.fullName ||
                !customer.phoneNumber
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Customer name and phone number are required.",

                });

            }


            // ==============================================
            // VALIDATE ITEMS
            // ==============================================

            if (
                !Array.isArray(items) ||
                items.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "At least one quotation item is required.",

                });

            }


            // ==============================================
            // LOAD SYSTEM PREFERENCES
            // ==============================================

            let preferences =
                await SystemPreference.findOne();


            // ----------------------------------------------
            // CREATE DEFAULT IF NONE EXISTS
            // ----------------------------------------------

            if (!preferences) {

                preferences =
                    await SystemPreference.create({});

            }


            // ==============================================
            // LOAD QUOTATION SETTINGS
            // ==============================================

            let quotationSettings =
                await QuotationSetting.findOne();


            // ----------------------------------------------
            // CREATE DEFAULT IF NONE EXISTS
            // ----------------------------------------------

            if (!quotationSettings) {

                quotationSettings =
                    await QuotationSetting.create({});

            }


            // ==============================================
            // LOAD COMPANY PROFILE
            // ==============================================

            const company =
                await Company.findOne();


            // ==============================================
            // COMPANY PROFILE REQUIRED
            // ==============================================

            if (!company) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Company profile must be configured before creating a quotation.",

                });

            }


            // ==============================================
            // CALCULATE ITEMS
            // ==============================================

            const quotationItems =
                items.map((item) => {

                    const quantity =
                        Number(item.quantity || 0);

                    const unitPrice =
                        Number(item.unitPrice || 0);


                    if (!item.description) {

                        throw new Error(
                            "Every quotation item must have a description."
                        );

                    }


                    if (!item.unit) {

                        throw new Error(
                            "Every quotation item must have a unit."
                        );

                    }


                    if (quantity < 0) {

                        throw new Error(
                            "Item quantity cannot be negative."
                        );

                    }


                    if (unitPrice < 0) {

                        throw new Error(
                            "Item unit price cannot be negative."
                        );

                    }


                    const amount =
                        quantity * unitPrice;


                    return {

                        description:
                            item.description.trim(),

                        quantity,

                        unit:
                            item.unit.trim(),

                        unitPrice,

                        amount,

                    };

                });


            // ==============================================
            // CALCULATE SUBTOTAL
            // ==============================================

            const subtotal =
                quotationItems.reduce(

                    (total, item) =>

                        total + item.amount,

                    0

                );


            // ==============================================
            // GENERATE QUOTATION NUMBER
            //
            // The frontend does NOT supply this.
            // ==============================================

            const quotationNumber =
                await generateQuotationNumber(

                    preferences.quotationPrefix

                );


            // ==============================================
            // QUOTATION DATE
            //
            // If frontend does not provide a date,
            // use the current date.
            // ==============================================

            const finalQuotationDate =
                quotationDate
                    ? new Date(quotationDate)
                    : new Date();


            // ==============================================
            // VALID UNTIL
            //
            // If frontend supplies a date, use it.
            //
            // Otherwise calculate it using the default
            // validity stored in System Preferences.
            // ==============================================

            let finalValidUntil;


            if (validUntil) {

                finalValidUntil =
                    new Date(validUntil);

            } else {

                finalValidUntil =
                    new Date(finalQuotationDate);


                finalValidUntil.setDate(

                    finalValidUntil.getDate() +

                    Number(
                        preferences.defaultValidity || 30
                    )

                );

            }


            // ==============================================
            // CREATE COMPANY SNAPSHOT
            //
            // This preserves the company information that
            // existed when the quotation was created.
            // ==============================================

            const companySnapshot = {

                companyName:
                    company.companyName || "",

                email:
                    company.email || "",

                phoneNumber:
                    company.phoneNumber || "",

                whatsappNumber:
                    company.whatsappNumber || "",

                physicalAddress:
                    company.physicalAddress || "",

                website:
                    company.website || "",

                logo:
                    company.logo || "",

            };


            // ==============================================
            // CREATE SETTINGS SNAPSHOT
            //
            // This preserves quotation settings that existed
            // when the quotation was created.
            // ==============================================

            const settingsSnapshot = {

                // ------------------------------------------
                // SYSTEM PREFERENCES
                // ------------------------------------------

                currency:
                    preferences.currency,

                currencyDisplay:
                    preferences.currencyDisplay,

                dateFormat:
                    preferences.dateFormat,

                timezone:
                    preferences.timezone,

                quotationPrefix:
                    preferences.quotationPrefix,

                defaultValidity:
                    preferences.defaultValidity,


                // ------------------------------------------
                // QUOTATION SETTINGS
                // ------------------------------------------

                bankName:
                    quotationSettings.bankName || "",

                accountName:
                    quotationSettings.accountName || "",

                accountNumber:
                    quotationSettings.accountNumber || "",

                mobileMoneyNumber:
                    quotationSettings.mobileMoneyNumber || "",

                mobileMoneyName:
                    quotationSettings.mobileMoneyName || "",

                termsAndConditions:
                    quotationSettings.termsAndConditions || "",

                footerMessage:
                    quotationSettings.footerMessage || "",

            };


            // ==============================================
            // CREATE OFFICIAL QUOTATION
            // ==============================================

            const officialQuotation =
                await OfficialQuotation.create({

                    quotationNumber,

                    quotationDate:
                        finalQuotationDate,

                    validUntil:
                        finalValidUntil,

                    customer: {

                        fullName:
                            customer.fullName.trim(),

                        company:
                            customer.company || "",

                        phoneNumber:
                            customer.phoneNumber.trim(),

                        email:
                            customer.email || "",

                        address:
                            customer.address || "",

                    },

                    project: {

                        projectName:
                            project?.projectName || "",

                        projectLocation:
                            project?.projectLocation || "",

                        projectDescription:
                            project?.projectDescription || "",

                    },

                    items:
                        quotationItems,

                    subtotal,

                    companySnapshot,

                    settingsSnapshot,

                    status:
                        "Draft",

                    createdBy:
                        req.admin._id,

                });


            // ==============================================
            // SUCCESS RESPONSE
            // ==============================================

            return res.status(201).json({

                success: true,

                message:
                    "Official quotation created successfully.",

                data:
                    officialQuotation,

            });


        } catch (error) {

            console.error(

                "Create official quotation error:",

                error

            );


            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Unable to create official quotation.",

            });

        }

    };


// ======================================================
// GET ALL OFFICIAL QUOTATIONS
//
// GET:
// /api/official-quotations
//
// Returns official quotations ordered from newest
// to oldest.
//
// The frontend will handle pagination for now.
// ======================================================

const getOfficialQuotations =
    async (req, res) => {

        try {

            const quotations =
                await OfficialQuotation.find()

                    .sort({
                        createdAt: -1,
                    })

                    .lean();


            return res.status(200).json({

                success: true,

                data:
                    quotations,

            });


        } catch (error) {

            console.error(

                "Get official quotations error:",

                error

            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to retrieve official quotations.",

            });

        }

    };


// ======================================================
// GET SINGLE OFFICIAL QUOTATION
//
// GET:
// /api/official-quotations/:id
// ======================================================

const getOfficialQuotation =
    async (req, res) => {

        try {

            const quotation =
                await OfficialQuotation.findById(

                    req.params.id

                ).lean();


            // ----------------------------------------------
            // QUOTATION NOT FOUND
            // ----------------------------------------------

            if (!quotation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Official quotation not found.",

                });

            }


            return res.status(200).json({

                success: true,

                data:
                    quotation,

            });


        } catch (error) {

            console.error(

                "Get official quotation error:",

                error

            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to retrieve official quotation.",

            });

        }

    };

// ======================================================
// GENERATE OFFICIAL QUOTATION PDF
//
// GET:
// /api/official-quotations/:id/pdf
//
// Retrieves the saved quotation from MongoDB and
// generates a PDF using the stored quotation data.
// ======================================================

const generateOfficialQuotationPdf =
    async (req, res) => {

        try {

            const quotation =
                await OfficialQuotation.findById(
                    req.params.id
                ).lean();


            // ----------------------------------------------
            // QUOTATION NOT FOUND
            // ----------------------------------------------

            if (!quotation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Official quotation not found.",

                });

            }


            // ----------------------------------------------
            // GENERATE PDF
            // ----------------------------------------------

            const pdfBuffer =
                await generateQuotationPdf(
                    quotation
                );


            // ----------------------------------------------
            // PDF RESPONSE
            // ----------------------------------------------

            res.setHeader(
                "Content-Type",
                "application/pdf"
            );


            res.setHeader(

                "Content-Disposition",

                `attachment; filename="${quotation.quotationNumber}.pdf"`

            );


            res.setHeader(

                "Content-Length",

                pdfBuffer.length

            );


            return res.send(
                pdfBuffer
            );


        } catch (error) {

            console.error(

                "Generate official quotation PDF error:",

                error

            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to generate quotation PDF.",

            });

        }

    }; 


// ======================================================
// UPDATE OFFICIAL QUOTATION
//
// PUT:
// /api/official-quotations/:id
//
// IMPORTANT:
//
// quotationNumber is NEVER changed.
//
// companySnapshot and settingsSnapshot are also preserved
// so that an old quotation continues to represent the
// company/settings that existed when it was created.
// ======================================================

const updateOfficialQuotation =
    async (req, res) => {

        try {

            // ==============================================
            // GET REQUEST DATA
            // ==============================================

            const {

                quotationDate,

                validUntil,

                customer,

                project,

                items,

                status,

            } = req.body;


            // ==============================================
            // VALIDATE CUSTOMER
            // ==============================================

            if (
                !customer ||
                !customer.fullName ||
                !customer.phoneNumber
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Customer name and phone number are required.",

                });

            }


            // ==============================================
            // VALIDATE ITEMS
            // ==============================================

            if (
                !Array.isArray(items) ||
                items.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "At least one quotation item is required.",

                });

            }


            // ==============================================
            // RECALCULATE ITEMS
            //
            // Never trust the subtotal or amount sent by
            // the frontend.
            // ==============================================

            const quotationItems =
                items.map((item) => {

                    const quantity =
                        Number(item.quantity || 0);

                    const unitPrice =
                        Number(item.unitPrice || 0);


                    if (!item.description) {

                        throw new Error(
                            "Every quotation item must have a description."
                        );

                    }


                    if (!item.unit) {

                        throw new Error(
                            "Every quotation item must have a unit."
                        );

                    }


                    if (quantity < 0) {

                        throw new Error(
                            "Item quantity cannot be negative."
                        );

                    }


                    if (unitPrice < 0) {

                        throw new Error(
                            "Item unit price cannot be negative."
                        );

                    }


                    const amount =
                        quantity * unitPrice;


                    return {

                        description:
                            item.description.trim(),

                        quantity,

                        unit:
                            item.unit.trim(),

                        unitPrice,

                        amount,

                    };

                });


            // ==============================================
            // RECALCULATE SUBTOTAL
            // ==============================================

            const subtotal =
                quotationItems.reduce(

                    (total, item) =>

                        total + item.amount,

                    0

                );


            // ==============================================
            // BUILD UPDATE DATA
            //
            // quotationNumber is deliberately NOT included.
            // companySnapshot/settingsSnapshot are also
            // deliberately NOT included.
            // ==============================================

            const updateData = {

                customer: {

                    fullName:
                        customer.fullName.trim(),

                    company:
                        customer.company || "",

                    phoneNumber:
                        customer.phoneNumber.trim(),

                    email:
                        customer.email || "",

                    address:
                        customer.address || "",

                },

                project: {

                    projectName:
                        project?.projectName || "",

                    projectLocation:
                        project?.projectLocation || "",

                    projectDescription:
                        project?.projectDescription || "",

                },

                items:
                    quotationItems,

                subtotal,

            };


            // ==============================================
            // UPDATE DATES ONLY WHEN PROVIDED
            // ==============================================

            if (quotationDate) {

                updateData.quotationDate =
                    new Date(quotationDate);

            }


            if (validUntil) {

                updateData.validUntil =
                    new Date(validUntil);

            }


            // ==============================================
            // UPDATE STATUS IF PROVIDED
            // ==============================================

            if (status) {

                const allowedStatuses = [

                    "Draft",
                    "Issued",
                    "Accepted",
                    "Rejected",
                    "Expired",

                ];


                if (
                    !allowedStatuses.includes(status)
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Invalid quotation status.",

                    });

                }


                updateData.status =
                    status;

            }


            // ==============================================
            // UPDATE QUOTATION
            // ==============================================

            const quotation =
                await OfficialQuotation.findByIdAndUpdate(

                    req.params.id,

                    updateData,

                    {
                        new: true,
                        runValidators: true,
                    }

                );


            // ==============================================
            // QUOTATION NOT FOUND
            // ==============================================

            if (!quotation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Official quotation not found.",

                });

            }


            // ==============================================
            // SUCCESS RESPONSE
            // ==============================================

            return res.status(200).json({

                success: true,

                message:
                    "Official quotation updated successfully.",

                data:
                    quotation,

            });


        } catch (error) {

            console.error(

                "Update official quotation error:",

                error

            );


            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Unable to update official quotation.",

            });

        }

    };


// ======================================================
// DELETE OFFICIAL QUOTATION
//
// DELETE:
// /api/official-quotations/:id
// ======================================================

const deleteOfficialQuotation =
    async (req, res) => {

        try {

            const quotation =
                await OfficialQuotation.findByIdAndDelete(

                    req.params.id

                );


            // ----------------------------------------------
            // QUOTATION NOT FOUND
            // ----------------------------------------------

            if (!quotation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Official quotation not found.",

                });

            }


            // ==============================================
            // SUCCESS RESPONSE
            // ==============================================

            return res.status(200).json({

                success: true,

                message:
                    "Official quotation deleted successfully.",

            });


        } catch (error) {

            console.error(

                "Delete official quotation error:",

                error

            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to delete official quotation.",

            });

        }

    };


// ======================================================
// EXPORT CONTROLLERS
// ======================================================

export {

    createOfficialQuotation,

    getOfficialQuotations,

    getOfficialQuotation,

    generateOfficialQuotationPdf,

    updateOfficialQuotation,

    deleteOfficialQuotation,

};