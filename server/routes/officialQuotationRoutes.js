// ======================================================
// FILE: officialQuotationRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines protected API routes for official quotations.
//
// AUTHOR:
// Joel Butala
// ======================================================


import express from "express";


// ======================================================
// IMPORT AUTHENTICATION MIDDLEWARE
// ======================================================

import {
    protect,
} from "../middleware/authMiddleware.js";


// ======================================================
// IMPORT CONTROLLERS
// ======================================================

import {

    createOfficialQuotation,

    getOfficialQuotations,

    getOfficialQuotation,

    updateOfficialQuotation,

    deleteOfficialQuotation,

    generateOfficialQuotationPdf,

} from "../controllers/officialQuotationController.js";


// ======================================================
// CREATE ROUTER
// ======================================================

const router =
    express.Router();


// ======================================================
// CREATE OFFICIAL QUOTATION
//
// POST:
// /api/official-quotations
//
// Only authenticated administrators can create
// official quotations.
// ======================================================

router.post(

    "/",

    protect,

    createOfficialQuotation

);


// ======================================================
// GET ALL OFFICIAL QUOTATIONS
//
// GET:
// /api/official-quotations
//
// Returns all saved official quotations.
// ======================================================

router.get(

    "/",

    protect,

    getOfficialQuotations

);

// ======================================================
// GENERATE OFFICIAL QUOTATION PDF
//
// GET:
// /api/official-quotations/:id/pdf
// ======================================================

router.get(

    "/:id/pdf",

    protect,

    generateOfficialQuotationPdf

);


// ======================================================
// GET SINGLE OFFICIAL QUOTATION
//
// GET:
// /api/official-quotations/:id
//
// Returns one quotation by MongoDB ID.
// ======================================================

router.get(

    "/:id",

    protect,

    getOfficialQuotation

);


// ======================================================
// UPDATE OFFICIAL QUOTATION
//
// PUT:
// /api/official-quotations/:id
//
// Updates an existing quotation.
//
// The quotation number cannot be changed.
// ======================================================

router.put(

    "/:id",

    protect,

    updateOfficialQuotation

);


// ======================================================
// DELETE OFFICIAL QUOTATION
//
// DELETE:
// /api/official-quotations/:id
//
// Deletes an existing quotation.
// ======================================================

router.delete(

    "/:id",

    protect,

    deleteOfficialQuotation

);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;