// ======================================================
// FILE: adminRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines Administrator Profile API routes.
//
// RESPONSIBILITIES:
// • Get administrator profile
// • Update administrator profile
// • Upload profile photo
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

    getAdminProfile,

    updateAdminProfile,

} from "../controllers/adminController.js";


// ======================================================
// IMPORT PROFILE PHOTO UPLOAD
// ======================================================

import {

    uploadProfile,

} from "../config/multer.js";


// ======================================================
// CREATE ROUTER
// ======================================================

const router = express.Router();


// ======================================================
// GET ADMINISTRATOR PROFILE
//
// GET /api/admin/profile
// ======================================================

router.get(

    "/profile",

    getAdminProfile

);


// ======================================================
// UPDATE ADMINISTRATOR PROFILE
//
// PUT /api/admin/profile
//
// ACCEPTS:
//
// • fullName
// • email
// • phoneNumber
// • profilePhoto
//
// profilePhoto accepts one image.
// ======================================================

router.put(

    "/profile",

    uploadProfile.single(
        "profilePhoto"
    ),

    updateAdminProfile

);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;