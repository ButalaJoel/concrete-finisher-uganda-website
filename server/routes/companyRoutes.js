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
import { protect } from "../middleware/authMiddleware.js";

import {

    getCompanyProfile,
    updateCompanyProfile

} from "../controllers/companyController.js";

import {

    uploadCompanyLogo

} from "../config/multer.js";
import {
    handleImageUploadError,
    validateImageUploads,
} from "../middleware/imageUploadMiddleware.js";


// ======================================================
// CREATE ROUTER
// ======================================================

const router = express.Router();

router.use(protect);


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

    validateImageUploads,

    updateCompanyProfile,

    handleImageUploadError

);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;