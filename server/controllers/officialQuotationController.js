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

import mongoose from "mongoose";

import OfficialQuotation
    from "../models/OfficialQuotation.js";

import QuotationCounter
    from "../models/QuotationCounter.js";

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

const escapeRegex = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateQuotationNumber = async (prefix) => {

    // --------------------------------------------------
    // NORMALISE PREFIX
    // --------------------------------------------------

    const cleanPrefix =
        String(prefix || "CFU-QT")
            .trim()
            .toUpperCase();

    if (!cleanPrefix) {
        throw new Error("Quotation number prefix cannot be empty.");
    }

    // Seed a new counter from saved records, so introducing the
    // counter does not restart numbering for existing quotations.
    let counter = await QuotationCounter.findById(cleanPrefix).lean();

    if (!counter) {
        const existingQuotations = await OfficialQuotation.find({
            quotationNumber: {
                $regex: `^${escapeRegex(cleanPrefix)}-`,
                $options: "i",
            },
        })
            .select("quotationNumber")
            .lean();

        const highestNumber = existingQuotations.reduce(
            (highest, quotation) => {
                const match = quotation.quotationNumber.match(/-(\d+)$/);
                const value = match ? Number(match[1]) : 0;
                return Number.isSafeInteger(value)
                    ? Math.max(highest, value)
                    : highest;
            },
            0
        );

        try {
            await QuotationCounter.create({
                _id: cleanPrefix,
                sequence: highestNumber,
            });
        } catch (error) {
            // Concurrent first requests may both try to seed the same
            // counter. The unique _id lets one win; the other increments it.
            if (error.code !== 11000) {
                throw error;
            }
        }
    }

    const updatedCounter = await QuotationCounter.findOneAndUpdate(
        { _id: cleanPrefix },
        { $inc: { sequence: 1 } },
        { new: true, runValidators: true }
    );

    if (!updatedCounter || !Number.isSafeInteger(updatedCounter.sequence)) {
        throw new Error("Unable to allocate a quotation number.");
    }


    // --------------------------------------------------
    // PAD WITH ZEROS
    //
    // 1    → 001
    // 12   → 012
    // 123  → 123
    // 1000 → 1000
    // --------------------------------------------------

    const formattedNumber =
        String(updatedCounter.sequence).padStart(3, "0");


    return `${cleanPrefix}-${formattedNumber}`;

};

const createInputError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const getQuotationErrorStatus = (error) => {
    if (error.statusCode) {
        return error.statusCode;
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
        return 400;
    }
    return error.code === 11000 ? 409 : 500;
};

const normalizeQuotationItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw createInputError("At least one quotation item is required.");
    }

    const normalizedItems = items.map((item) => {
        if (
            !item ||
            typeof item.description !== "string" ||
            !item.description.trim() ||
            typeof item.unit !== "string" ||
            !item.unit.trim()
        ) {
            throw createInputError(
                "Every quotation item must have a description and unit."
            );
        }

        const parseNumber = (value) => {
            if (
                (typeof value !== "number" && typeof value !== "string") ||
                (typeof value === "string" && !value.trim())
            ) {
                return NaN;
            }
            return Number(value);
        };
        const quantity = parseNumber(item.quantity);
        const unitPrice = parseNumber(item.unitPrice);

        if (!Number.isFinite(quantity) || quantity < 0) {
            throw createInputError(
                "Item quantity must be a finite, non-negative number."
            );
        }

        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw createInputError(
                "Item unit price must be a finite, non-negative number."
            );
        }

        const amount = quantity * unitPrice;
        if (!Number.isFinite(amount) || amount < 0) {
            throw createInputError("Quotation item amount is invalid.");
        }

        return {
            description: item.description.trim(),
            quantity,
            unit: item.unit.trim(),
            unitPrice,
            amount,
        };
    });

    const subtotal = normalizedItems.reduce(
        (total, item) => total + item.amount,
        0
    );

    if (!Number.isFinite(subtotal) || subtotal < 0) {
        throw createInputError("Quotation subtotal is invalid.");
    }

    return { items: normalizedItems, subtotal };
};

const parseQuotationDate = (value, label) => {
    if (typeof value !== "string" || !value.trim()) {
        throw createInputError(`${label} must be a valid date.`);
    }
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
        throw createInputError(`${label} must be a valid date.`);
    }
    return parsedDate;
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

            const body =
                req.body && typeof req.body === "object"
                    ? req.body
                    : {};
            const {

                quotationDate,

                validUntil,

                customer,

                project,

                items,

            } = body;


            // ==============================================
            // VALIDATE CUSTOMER
            // ==============================================

            if (
                !customer ||
                typeof customer.fullName !== "string" ||
                !customer.fullName.trim() ||
                typeof customer.phoneNumber !== "string" ||
                !customer.phoneNumber.trim()
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

            const {
                items: quotationItems,
                subtotal,
            } = normalizeQuotationItems(items);


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
                quotationDate === undefined || quotationDate === null
                    ? new Date()
                    : parseQuotationDate(quotationDate, "Quotation date");


            // ==============================================
            // VALID UNTIL
            //
            // If frontend supplies a date, use it.
            //
            // Otherwise calculate it using the default
            // validity stored in System Preferences.
            // ==============================================

            let finalValidUntil;


            if (validUntil !== undefined && validUntil !== null) {

                finalValidUntil =
                    parseQuotationDate(validUntil, "Valid-until date");

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

            if (finalValidUntil < finalQuotationDate) {
                throw createInputError(
                    "Valid-until date cannot be earlier than the quotation date."
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


            const statusCode = getQuotationErrorStatus(error);
            return res.status(statusCode).json({

                success: false,

                message: statusCode === 500
                    ? "Unable to create official quotation."
                    : error.message,

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
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quotation identifier.",
                });
            }

            const quotation = await OfficialQuotation.findById(req.params.id);
            if (!quotation) {
                return res.status(404).json({
                    success: false,
                    message: "Official quotation not found.",
                });
            }

            const body = req.body || {};
            const requestedStatus = body.status;
            const allowedStatuses = [
                "Draft",
                "Issued",
                "Accepted",
                "Rejected",
                "Expired",
            ];

            if (
                requestedStatus !== undefined &&
                !allowedStatuses.includes(requestedStatus)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quotation status.",
                });
            }

            const hasContentChanges = [
                "quotationDate",
                "validUntil",
                "customer",
                "project",
                "items",
            ].some((field) => body[field] !== undefined);

            if (
                quotation.status === "Draft" &&
                requestedStatus === "Issued" &&
                !hasContentChanges
            ) {
                const issuedQuotation =
                    await OfficialQuotation.findOneAndUpdate(
                        { _id: quotation._id, status: "Draft" },
                        { $set: { status: "Issued" } },
                        { new: true, runValidators: true }
                    );

                if (!issuedQuotation) {
                    return res.status(409).json({
                        success: false,
                        message: "The quotation changed during this request. Reload it and try again.",
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Official quotation issued successfully.",
                    data: issuedQuotation,
                });
            }

            // Only draft documents may have their contents edited. Once issued,
            // a status-only transition is permitted without changing the saved
            // document used to render the existing PDF format.
            if (quotation.status !== "Draft") {
                if (hasContentChanges) {
                    return res.status(409).json({
                        success: false,
                        message: "Only draft quotations can be edited. Issued quotation contents are preserved.",
                    });
                }

                const allowedTransitions = {
                    Issued: ["Accepted", "Rejected", "Expired"],
                    Accepted: [],
                    Rejected: [],
                    Expired: [],
                };
                const nextStatuses = allowedTransitions[quotation.status] || [];

                if (
                    !requestedStatus ||
                    !nextStatuses.includes(requestedStatus)
                ) {
                    return res.status(409).json({
                        success: false,
                        message: "This quotation status cannot be changed.",
                    });
                }

                const statusUpdated = await OfficialQuotation.findOneAndUpdate(
                    {
                        _id: quotation._id,
                        status: quotation.status,
                    },
                    { $set: { status: requestedStatus } },
                    { new: true, runValidators: true }
                );

                if (!statusUpdated) {
                    return res.status(409).json({
                        success: false,
                        message: "The quotation changed during this request. Reload it and try again.",
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Official quotation status updated successfully.",
                    data: statusUpdated,
                });
            }

            const {
                quotationDate,
                validUntil,
                customer,
                project,
                items,
            } = body;

            if (
                !customer ||
                typeof customer.fullName !== "string" ||
                !customer.fullName.trim() ||
                typeof customer.phoneNumber !== "string" ||
                !customer.phoneNumber.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Customer name and phone number are required.",
                });
            }

            const {
                items: quotationItems,
                subtotal,
            } = normalizeQuotationItems(items);

            const updateData = {
                customer: {
                    fullName: customer.fullName.trim(),
                    company: customer.company || "",
                    phoneNumber: customer.phoneNumber.trim(),
                    email: customer.email || "",
                    address: customer.address || "",
                },
                project: {
                    projectName: project?.projectName || "",
                    projectLocation: project?.projectLocation || "",
                    projectDescription: project?.projectDescription || "",
                },
                items: quotationItems,
                subtotal,
            };

            if (quotationDate !== undefined) {
                updateData.quotationDate = parseQuotationDate(
                    quotationDate,
                    "Quotation date"
                );
            }

            if (validUntil !== undefined) {
                updateData.validUntil = parseQuotationDate(
                    validUntil,
                    "Valid-until date"
                );
            }

            const effectiveQuotationDate =
                updateData.quotationDate || quotation.quotationDate;
            const effectiveValidUntil =
                updateData.validUntil || quotation.validUntil;

            if (effectiveValidUntil < effectiveQuotationDate) {
                throw createInputError(
                    "Valid-until date cannot be earlier than the quotation date."
                );
            }

            if (
                requestedStatus !== undefined &&
                requestedStatus !== "Draft" &&
                requestedStatus !== "Issued"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "A draft quotation may only remain Draft or be Issued.",
                });
            }

            if (requestedStatus !== undefined) {
                updateData.status = requestedStatus;
            }

            const updatedQuotation = await OfficialQuotation.findOneAndUpdate(
                {
                    _id: quotation._id,
                    status: "Draft",
                },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedQuotation) {
                return res.status(409).json({
                    success: false,
                    message: "Only draft quotations can be edited. Reload the quotation and try again.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Official quotation updated successfully.",
                data: updatedQuotation,
            });


        } catch (error) {

            console.error(

                "Update official quotation error:",

                error

            );


            const statusCode = getQuotationErrorStatus(error);
            return res.status(statusCode).json({

                success: false,

                message: statusCode === 500
                    ? "Unable to update official quotation."
                    : error.message,

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

            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quotation identifier.",
                });
            }

            const deletedQuotation =
                await OfficialQuotation.findOneAndDelete({
                    _id: req.params.id,
                    status: "Draft",
                });

            if (!deletedQuotation) {
                const existingQuotation = await OfficialQuotation.findById(
                    req.params.id
                )
                    .select("status")
                    .lean();

                if (!existingQuotation) {
                    return res.status(404).json({
                        success: false,
                        message: "Official quotation not found.",
                    });
                }

                return res.status(409).json({
                    success: false,
                    message: "Issued or finalized quotations cannot be permanently deleted.",
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