// ======================================================
// FILE: authRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines administrator authentication routes.
//
// AVAILABLE ROUTES:
//
// POST /api/auth/login
// PUT  /api/auth/change-password
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORT EXPRESS
// ======================================================

import express from "express";


// ======================================================
// IMPORT AUTHENTICATION CONTROLLERS
// ======================================================

import {

    loginAdmin,

    changePassword,

} from "../controllers/authController.js";  

import {

    protect,

} from "../middleware/authMiddleware.js";


// ======================================================
// CREATE ROUTER
// ======================================================

const router =
    express.Router();


// ======================================================
// LOGIN ADMINISTRATOR
//
// POST /api/auth/login
//
// ACCEPTS:
//
// • email
// • password
// ======================================================

router.post(

    "/login",

    loginAdmin

);


// ======================================================
// CHANGE PASSWORD
//
// PUT /api/auth/change-password
//
// ACCEPTS:
//
// • currentPassword
// • newPassword
// ======================================================

router.put(

    "/change-password",

    protect,

    changePassword

);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;