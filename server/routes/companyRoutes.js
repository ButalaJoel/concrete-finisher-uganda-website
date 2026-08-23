// ======================================================
// FILE: companyRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines API routes for managing company information.
//
// AVAILABLE ROUTES:
//
// GET /api/company/profile
// PUT /api/company/profile
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import express from "express";

import {

    getCompanyProfile,
    updateCompanyProfile

} from "../controllers/companyController.js";

import {

    uploadCompanyLogo

} from "../config/multer.js";


// ======================================================
// CREATE ROUTER
// ======================================================

const router = express.Router();


// ======================================================
// GET COMPANY PROFILE
//
// URL:
//
// GET /api/company/profile
// ======================================================

router.get(

    "/profile",

    getCompanyProfile

);


// ======================================================
// UPDATE COMPANY PROFILE
//
// URL:
//
// PUT /api/company/profile
//
// Accepts:
//
// • companyLogo
// • companyName
// • email
// • phoneNumber
// • whatsappNumber
// • physicalAddress
// • website
// • description
// ======================================================

router.put(

    "/profile",

    uploadCompanyLogo.single(
        "companyLogo"
    ),

    updateCompanyProfile

);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;