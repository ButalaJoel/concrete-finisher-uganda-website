// ======================================================
// FILE: companyController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles Company Profile API operations.
//
// RESPONSIBILITIES:
// • Get company profile
// • Create the first company profile
// • Update company information
// • Upload and update company logo
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORT COMPANY MODEL
// ======================================================

import Company from "../models/Company.js";


// ======================================================
// GET COMPANY PROFILE
//
// ROUTE:
//
// GET /api/company
//
// PURPOSE:
//
// Returns the saved Concrete Finisher company profile.
// ======================================================

const getCompanyProfile = async (req, res) => {

    try {

        // Find the first company profile.
        //
        // This system currently supports one company
        // profile for Concrete Finisher Uganda.

        const company =
            await Company.findOne();


        // ----------------------------------------------
        // COMPANY PROFILE NOT CREATED
        // ----------------------------------------------

        if (!company) {

            return res.status(404).json({

                message:
                    "Company profile has not been created yet.",

            });

        }


        // ----------------------------------------------
        // SUCCESS
        // ----------------------------------------------

        res.status(200).json(company);

    } catch (error) {

        console.error(
            "Get company profile error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to load company profile.",

        });

    }

};


// ======================================================
// CREATE OR UPDATE COMPANY PROFILE
//
// ROUTE:
//
// PUT /api/company
//
// PURPOSE:
//
// • Creates the first company profile if none exists
// • Updates the existing company profile if it exists
// • Updates the company logo when a new file is uploaded
//
// This prevents the system from creating multiple
// Concrete Finisher company profiles.
// ======================================================

const updateCompanyProfile = async (req, res) => {

    try {

        // ==================================================
        // GET FORM DATA
        // ==================================================

        const {

            companyName,

            email,

            phoneNumber,

            whatsappNumber,

            physicalAddress,

            website,

            description,

        } = req.body;


        // ==================================================
        // FIND EXISTING COMPANY PROFILE
        // ==================================================

        let company =
            await Company.findOne();


        // ==================================================
        // CREATE FIRST COMPANY PROFILE
        // ==================================================

        if (!company) {

            // Company name is required when creating
            // the first profile.

            if (!companyName) {

                return res.status(400).json({

                    message:
                        "Company name is required.",

                });

            }


            company =
                new Company({

                    companyName,

                    email:
                        email || "",

                    phoneNumber:
                        phoneNumber || "",

                    whatsappNumber:
                        whatsappNumber || "",

                    physicalAddress:
                        physicalAddress || "",

                    website:
                        website || "",

                    description:
                        description || "",

                    // Save uploaded logo path if a logo
                    // was included in the request.

                    logo:
                        req.file
                            ? `/uploads/company/${req.file.filename}`
                            : "",

                });

        }


        // ==================================================
        // UPDATE EXISTING COMPANY PROFILE
        // ==================================================

        else {

            // Only replace values that were sent.

            if (companyName !== undefined) {

                company.companyName =
                    companyName;

            }


            if (email !== undefined) {

                company.email =
                    email;

            }


            if (phoneNumber !== undefined) {

                company.phoneNumber =
                    phoneNumber;

            }


            if (whatsappNumber !== undefined) {

                company.whatsappNumber =
                    whatsappNumber;

            }


            if (physicalAddress !== undefined) {

                company.physicalAddress =
                    physicalAddress;

            }


            if (website !== undefined) {

                company.website =
                    website;

            }


            if (description !== undefined) {

                company.description =
                    description;

            }


            // ----------------------------------------------
            // UPDATE LOGO
            //
            // Only change the logo when a new logo
            // was uploaded.
            // ----------------------------------------------

            if (req.file) {

                company.logo =
                    `/uploads/company/${req.file.filename}`;

            }

        }


        // ==================================================
        // SAVE COMPANY PROFILE
        // ==================================================

        const savedCompany =
            await company.save();


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        res.status(200).json({

            message:
                "Company profile saved successfully.",

            company:
                savedCompany,

        });

    } catch (error) {

        console.error(
            "Update company profile error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to save company profile.",

        });

    }

};


// ======================================================
// EXPORT CONTROLLER FUNCTIONS
// ======================================================

export {

    getCompanyProfile,

    updateCompanyProfile,

};