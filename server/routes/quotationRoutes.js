// ======================================================
// FILE: quotationRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines all API routes related to quotation
// management.
//
// RESPONSIBILITIES:
// • Create quotation
// • Get all quotations
// • Get one quotation
// • Update quotation
// • Delete quotation
//
// USED BY:
// index.js
//
// CONTROLLERS:
// quotationController.js
//
// AUTHOR:
// Joel Butala
// ======================================================

import express from "express";

import {
  createQuotation,
  getQuotations,
} from "../controllers/quotationController.js";

const router = express.Router();

// ======================================================
// CREATE QUOTATION
// Route:
// POST /api/quotations
// ======================================================

router.post("/", createQuotation);

// ======================================================
// GET ALL QUOTATIONS
// Route:
// GET /api/quotations
// ======================================================

router.get("/", getQuotations);



export default router;