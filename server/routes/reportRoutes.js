// ======================================================
// FILE: reportRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// API routes for dashboard reports and analytics.
//
// AUTHOR:
// Joel Butala
// ======================================================

import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {

    getReportOverview,

} from "../controllers/reportController.js";


// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

router.use(protect);


// ======================================================
// GET REPORT OVERVIEW
//
// URL:
//
// /api/reports
// ======================================================

router.get(

    "/",

    getReportOverview

);


// ======================================================
// EXPORT
// ======================================================

export default router;