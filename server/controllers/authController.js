// ======================================================
// FILE: authController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles administrator authentication.
//
// RESPONSIBILITIES:
// • Administrator login
// • Password verification
// • Password changes
// • JWT token generation
//
// SECURITY:
// • Passwords are compared using bcryptjs
// • Password hashing is handled automatically by Admin.js
// • JWT tokens are generated after successful login
// • Protected routes identify the logged-in administrator
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";


// ======================================================
// LOGIN ADMINISTRATOR
//
// ROUTE:
//
// POST /api/auth/login
//
// REQUEST BODY:
//
// {
//     "email": "admin@example.com",
//     "password": "your-password"
// }
// ======================================================

const loginAdmin = async (req, res) => {

    try {

        // ==================================================
        // GET LOGIN DATA
        // ==================================================

        const {

            email,

            password,

        } = req.body;


        // ==================================================
        // VALIDATE INPUT
        // ==================================================

        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required.",

            });

        }


        // ==================================================
        // FIND ADMINISTRATOR
        // ==================================================

        const admin =
            await Admin.findOne({

                email:
                    email.toLowerCase(),

            });


        // ==================================================
        // ADMINISTRATOR NOT FOUND
        // ==================================================

        if (!admin) {

            return res.status(401).json({

                message:
                    "Invalid email or password.",

            });

        }


        // ==================================================
        // CHECK ACCOUNT STATUS
        // ==================================================

        if (!admin.isActive) {

            return res.status(403).json({

                message:
                    "This administrator account has been disabled.",

            });

        }


        // ==================================================
        // CHECK PASSWORD EXISTS
        // ==================================================

        if (!admin.password) {

            return res.status(400).json({

                message:
                    "This administrator account does not have a password configured yet.",

            });

        }


        // ==================================================
        // VERIFY PASSWORD
        //
        // Compare the entered password with the hashed
        // password stored in MongoDB.
        // ==================================================

        const passwordMatches =
            await bcrypt.compare(

                password,

                admin.password

            );


        // ==================================================
        // INVALID PASSWORD
        // ==================================================

        if (!passwordMatches) {

            return res.status(401).json({

                message:
                    "Invalid email or password.",

            });

        }


        // ==================================================
        // CHECK JWT SECRET
        // ==================================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing from the environment."
            );

            return res.status(500).json({

                message:
                    "Server authentication configuration error.",

            });

        }


        // ==================================================
        // CREATE JWT TOKEN
        // ==================================================

        const token =
            jwt.sign(

                {

                    adminId:
                        admin._id.toString(),

                    role:
                        admin.role,

                },

                process.env.JWT_SECRET,

                {

                    expiresIn:
                        "7d",

                }

            );


        // ==================================================
        // SUCCESS RESPONSE
        //
        // Never return the password.
        // ==================================================

        return res.status(200).json({

            message:
                "Login successful.",

            token,

            admin: {

                id:
                    admin._id,

                fullName:
                    admin.fullName,

                email:
                    admin.email,

                phoneNumber:
                    admin.phoneNumber,

                profilePhoto:
                    admin.profilePhoto,

                role:
                    admin.role,

            },

        });

    }

    catch (error) {

        console.error(
            "Administrator login error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to log in.",

        });

    }

};


// ======================================================
// CHANGE PASSWORD
//
// ROUTE:
//
// PUT /api/auth/change-password
//
// PROTECTED:
//
// Requires a valid JWT token.
//
// REQUEST BODY:
//
// {
//     "currentPassword": "old-password",
//     "newPassword": "new-password"
// }
//
// IMPORTANT:
//
// The password is NOT manually hashed in this controller.
//
// Admin.js has a pre-save middleware that automatically
// hashes the password when admin.save() is called.
// ======================================================

const changePassword = async (req, res) => {

    try {

        // ==================================================
        // GET PASSWORD DATA
        // ==================================================

        const {

            currentPassword,

            newPassword,

        } = req.body;


        // ==================================================
        // VALIDATE INPUT
        // ==================================================

        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({

                message:
                    "Current password and new password are required.",

            });

        }


        // ==================================================
        // CHECK PASSWORD LENGTH
        // ==================================================

        if (newPassword.length < 8) {

            return res.status(400).json({

                message:
                    "New password must be at least 8 characters long.",

            });

        }


        // ==================================================
        // FIND AUTHENTICATED ADMINISTRATOR
        //
        // The protect middleware attaches the authenticated
        // administrator to:
        //
        // req.admin
        // ==================================================

        const admin =
            await Admin.findById(

                req.admin._id

            );


        // ==================================================
        // ADMINISTRATOR NOT FOUND
        // ==================================================

        if (!admin) {

            return res.status(404).json({

                message:
                    "Administrator account not found.",

            });

        }


        // ==================================================
        // CHECK ACCOUNT STATUS
        // ==================================================

        if (!admin.isActive) {

            return res.status(403).json({

                message:
                    "This administrator account has been disabled.",

            });

        }


        // ==================================================
        // CHECK PASSWORD EXISTS
        // ==================================================

        if (!admin.password) {

            return res.status(400).json({

                message:
                    "No existing password has been configured for this account.",

            });

        }


        // ==================================================
        // VERIFY CURRENT PASSWORD
        // ==================================================

        const passwordMatches =
            await bcrypt.compare(

                currentPassword,

                admin.password

            );


        // ==================================================
        // CURRENT PASSWORD INCORRECT
        // ==================================================

        if (!passwordMatches) {

            return res.status(401).json({

                message:
                    "Current password is incorrect.",

            });

        }


        // ==================================================
        // PREVENT REUSING CURRENT PASSWORD
        // ==================================================

        const samePassword =
            await bcrypt.compare(

                newPassword,

                admin.password

            );


        if (samePassword) {

            return res.status(400).json({

                message:
                    "Your new password must be different from your current password.",

            });

        }


        // ==================================================
        // ASSIGN NEW PASSWORD
        //
        // IMPORTANT:
        //
        // Do NOT use bcrypt.hash() here.
        //
        // Admin.js automatically hashes this password
        // before saving.
        // ==================================================

        admin.password =
            newPassword;


        // ==================================================
        // SAVE ADMINISTRATOR
        //
        // This triggers the pre-save password hashing
        // middleware in Admin.js.
        // ==================================================

        await admin.save();


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        return res.status(200).json({

            message:
                "Password updated successfully.",

        });

    }

    catch (error) {

        console.error(
            "Change password error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to update password.",

        });

    }

};


// ======================================================
// EXPORT CONTROLLER FUNCTIONS
// ======================================================

export {

    loginAdmin,

    changePassword,

};