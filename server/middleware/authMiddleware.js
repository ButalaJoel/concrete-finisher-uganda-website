// ======================================================
// FILE: authMiddleware.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Protects backend routes using JWT authentication.
//
// RESPONSIBILITIES:
// • Read JWT token from incoming requests
// • Verify the JWT token
// • Identify the logged-in administrator
// • Check whether the administrator still exists
// • Check whether the administrator account is active
// • Attach administrator information to the request
// • Block unauthorized access
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORT JSON WEB TOKEN
//
// Used to verify authentication tokens sent by the
// frontend.
// ======================================================

import jwt from "jsonwebtoken";


// ======================================================
// IMPORT ADMIN MODEL
//
// Used to find the administrator stored inside the
// JWT token.
// ======================================================

import Admin from "../models/Admin.js";


// ======================================================
// PROTECT ROUTE MIDDLEWARE
//
// This function runs BEFORE a protected controller.
//
// Example:
//
// Frontend Request
//        ↓
// Authorization: Bearer JWT_TOKEN
//        ↓
// protect middleware
//        ↓
// Verify token
//        ↓
// Find administrator
//        ↓
// Allow request to continue
// ======================================================

const protect = async (req, res, next) => {

    try {

        // ==================================================
        // GET AUTHORIZATION HEADER
        //
        // Expected format:
        //
        // Authorization: Bearer your_jwt_token_here
        // ==================================================

        const authorizationHeader =
            req.headers.authorization;


        // ==================================================
        // CHECK WHETHER AUTHORIZATION HEADER EXISTS
        // ==================================================

        if (!authorizationHeader) {

            return res.status(401).json({

                message:
                    "Authorization token is required.",

            });

        }


        // ==================================================
        // CHECK TOKEN FORMAT
        //
        // We expect:
        //
        // Bearer TOKEN
        // ==================================================

        if (
            !authorizationHeader.startsWith(
                "Bearer "
            )
        ) {

            return res.status(401).json({

                message:
                    "Invalid authorization token format.",

            });

        }


        // ==================================================
        // EXTRACT TOKEN
        //
        // Example:
        //
        // "Bearer abc123xyz"
        //
        // becomes:
        //
        // "abc123xyz"
        // ==================================================

        const token =
            authorizationHeader.split(" ")[1];


        // ==================================================
        // CHECK JWT SECRET
        // ==================================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing from the server environment."
            );

            return res.status(500).json({

                message:
                    "Server authentication configuration error.",

            });

        }


        // ==================================================
        // VERIFY TOKEN
        //
        // This checks:
        //
        // • The token was signed using our JWT_SECRET
        // • The token has not been changed
        // • The token has not expired
        //
        // If verification fails, jwt.verify() throws an error.
        // ==================================================

        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET

            );


        // ==================================================
        // FIND AUTHENTICATED ADMINISTRATOR
        //
        // The adminId was stored inside the JWT during login.
        //
        // We use that ID to find the administrator.
        //
        // select("-password") ensures the password hash is
        // not attached to the request.
        // ==================================================

        const admin =
            await Admin.findById(

                decoded.adminId

            ).select(
                "-password"
            );


        // ==================================================
        // CHECK WHETHER ADMINISTRATOR EXISTS
        //
        // Example:
        //
        // An account may have been deleted after the token
        // was created.
        // ==================================================

        if (!admin) {

            return res.status(401).json({

                message:
                    "Administrator account no longer exists.",

            });

        }


        // ==================================================
        // CHECK ACCOUNT STATUS
        //
        // Even with a valid JWT, a disabled administrator
        // must not access protected routes.
        // ==================================================

        if (!admin.isActive) {

            return res.status(403).json({

                message:
                    "This administrator account has been disabled.",

            });

        }


        // ==================================================
        // ATTACH ADMINISTRATOR TO REQUEST
        //
        // This allows controllers after this middleware
        // to know who is currently logged in.
        //
        // Example:
        //
        // req.admin.fullName
        // req.admin.email
        // req.admin.role
        // ==================================================

        req.admin =
            admin;


        // ==================================================
        // CONTINUE TO THE NEXT FUNCTION
        //
        // This sends the request to the actual controller.
        // ==================================================

        next();

    }


    // ======================================================
    // TOKEN ERROR HANDLING
    // ======================================================

    catch (error) {

        // ==================================================
        // EXPIRED TOKEN
        // ==================================================

        if (
            error.name === "TokenExpiredError"
        ) {

            return res.status(401).json({

                message:
                    "Your session has expired. Please log in again.",

            });

        }


        // ==================================================
        // INVALID TOKEN
        // ==================================================

        if (
            error.name === "JsonWebTokenError"
        ) {

            return res.status(401).json({

                message:
                    "Invalid authentication token.",

            });

        }


        // ==================================================
        // OTHER AUTHENTICATION ERRORS
        // ==================================================

        console.error(
            "Authentication middleware error:",
            error
        );


        return res.status(500).json({

            message:
                "Unable to verify authentication.",
            
        });

    }

};


// ======================================================
// EXPORT MIDDLEWARE
// ======================================================

export {

    protect,

};