// ======================================================
// FILE: quotationSettingRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines protected API routes for quotation settings.
//
// AUTHOR:
// Joel Butala
// ======================================================


import express from "express";


// ======================================================
// IMPORT AUTHENTICATION MIDDLEWARE
// ======================================================

import { protect } from "../middleware/authMiddleware.js";


// ======================================================
// IMPORT CONTROLLER FUNCTIONS
// ======================================================

import {

    getQuotationSettings,

    updateQuotationSettings,

} from "../controllers/quotationSettingController.js";


// ======================================================
// CREATE ROUTER
// ======================================================

const router =
    express.Router();


// ======================================================
// GET QUOTATION SETTINGS
//
// GET /api/quotation-settings
//
// Only authenticated administrators can access this.
// ======================================================

router.get(

    "/",

    protect,

    getQuotationSettings

);


// ======================================================
// UPDATE QUOTATION SETTINGS
//
// PUT /api/quotation-settings
//
// Only authenticated administrators can modify these.
// ======================================================

router.put(

    "/",

    protect,

    updateQuotationSettings

);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;