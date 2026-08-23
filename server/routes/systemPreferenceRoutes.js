// ======================================================
// FILE: systemPreferenceRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines API routes for managing system preferences.
//
// AVAILABLE ROUTES:
//
// GET /api/preferences
// PUT /api/preferences
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORT EXPRESS
// ======================================================

import express from "express";


// ======================================================
// IMPORT CONTROLLER FUNCTIONS
// ======================================================

import {

    getSystemPreferences,

    updateSystemPreferences,

} from "../controllers/systemPreferenceController.js";


// ======================================================
// CREATE ROUTER
// ======================================================

const router =
    express.Router();


// ======================================================
// GET SYSTEM PREFERENCES
//
// URL:
//
// GET /api/preferences
// ======================================================

router.get(

    "/",

    getSystemPreferences

);


// ======================================================
// UPDATE SYSTEM PREFERENCES
//
// URL:
//
// PUT /api/preferences
// ======================================================

router.put(

    "/",

    updateSystemPreferences

);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;