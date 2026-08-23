// ======================================================
// FILE: adminController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles administrator profile operations.
//
// RESPONSIBILITIES:
// • Get administrator profile
// • Create initial administrator profile
// • Update administrator profile
// • Upload administrator profile photo
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORT ADMIN MODEL
// ======================================================

import Admin from "../models/Admin.js";


// ======================================================
// GET ADMINISTRATOR PROFILE
//
// GET /api/admin/profile
//
// PURPOSE:
// Returns the administrator profile information.
//
// IF NO PROFILE EXISTS:
// Returns a friendly response indicating that the
// administrator profile has not yet been created.
// ======================================================

const getAdminProfile = async (req, res) => {

    try {

        // ==============================================
        // FIND ADMINISTRATOR
        // ==============================================

        const admin =
            await Admin.findOne();


        // ==============================================
        // PROFILE DOES NOT EXIST
        // ==============================================

        if (!admin) {

            return res.status(404).json({

                message:
                    "Administrator profile has not been created yet.",

            });

        }


        // ==============================================
        // RETURN PROFILE
        // ==============================================

        res.status(200).json({

            admin,

        });

    }

    catch (error) {

        // ==============================================
        // SERVER ERROR
        // ==============================================

        console.error(
            "Error fetching administrator profile:",
            error
        );


        res.status(500).json({

            message:
                "Unable to load administrator profile.",

        });

    }

};


// ======================================================
// UPDATE ADMINISTRATOR PROFILE
//
// PUT /api/admin/profile
//
// PURPOSE:
// Updates administrator information.
//
// UPDATES:
// • Full name
// • Email address
// • Phone number
// • Profile photo
//
// IF NO ADMIN PROFILE EXISTS:
// Creates the first administrator profile.
//
// PROFILE PHOTO:
// If a new image is uploaded, its path is saved in
// MongoDB.
//
// Example:
//
// /uploads/profiles/profile-123456789-photo.jpg
// ======================================================

const updateAdminProfile = async (req, res) => {

    try {

        // ==============================================
        // EXTRACT FORM DATA
        // ==============================================

        const {

            fullName,

            email,

            phoneNumber,

        } = req.body;


        // ==============================================
        // FIND EXISTING ADMINISTRATOR
        // ==============================================

        let admin =
            await Admin.findOne();


        // ==============================================
        // PROFILE PHOTO PATH
        //
        // Only create a new path if a new photo was
        // uploaded.
        // ==============================================

        let profilePhoto;


        if (req.file) {

            profilePhoto =
                `/uploads/profiles/${req.file.filename}`;

        }


        // ==============================================
        // CREATE INITIAL ADMIN PROFILE
        //
        // This happens the first time the administrator
        // saves their profile.
        // ==============================================

        if (!admin) {

            // ------------------------------------------
            // VALIDATE REQUIRED FIELDS
            // ------------------------------------------

            if (!fullName || !email) {

                return res.status(400).json({

                    message:
                        "Full name and email are required.",

                });

            }


            // ------------------------------------------
            // CREATE PROFILE
            // ------------------------------------------

            admin =
                await Admin.create({

                    fullName,

                    email,

                    phoneNumber:
                        phoneNumber || "",

                    profilePhoto:
                        profilePhoto || "",

                });


            // ------------------------------------------
            // RETURN CREATED PROFILE
            // ------------------------------------------

            return res.status(201).json({

                message:
                    "Administrator profile created successfully.",

                admin,

            });

        }


        // ==============================================
        // UPDATE EXISTING PROFILE
        // ==============================================


        // ----------------------------------------------
        // FULL NAME
        // ----------------------------------------------

        if (fullName) {

            admin.fullName =
                fullName;

        }


        // ----------------------------------------------
        // EMAIL
        // ----------------------------------------------

        if (email) {

            admin.email =
                email;

        }


        // ----------------------------------------------
        // PHONE NUMBER
        //
        // Explicitly check against undefined so the user
        // can still save an empty phone number if needed.
        // ----------------------------------------------

        if (
            phoneNumber !== undefined
        ) {

            admin.phoneNumber =
                phoneNumber;

        }


        // ----------------------------------------------
        // PROFILE PHOTO
        //
        // Only replace the existing photo when the user
        // uploads a new one.
        // ----------------------------------------------

        if (profilePhoto) {

            admin.profilePhoto =
                profilePhoto;

        }


        // ==============================================
        // SAVE UPDATED PROFILE
        // ==============================================

        await admin.save();


        // ==============================================
        // RETURN SUCCESS RESPONSE
        // ==============================================

        res.status(200).json({

            message:
                "Administrator profile updated successfully.",

            admin,

        });

    }

    catch (error) {

        // ==============================================
        // DUPLICATE EMAIL ERROR
        //
        // MongoDB duplicate key error code is 11000.
        // ==============================================

        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                message:
                    "This email address is already in use.",

            });

        }


        // ==============================================
        // SERVER ERROR
        // ==============================================

        console.error(
            "Error updating administrator profile:",
            error
        );


        res.status(500).json({

            message:
                "Unable to update administrator profile.",

        });

    }

};


// ======================================================
// EXPORT CONTROLLER FUNCTIONS
// ======================================================

export {

    getAdminProfile,

    updateAdminProfile,

};