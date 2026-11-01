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
import { protect } from "../middleware/authMiddleware.js";


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

    validateImageUploads,

    updateAdminProfile,

    handleImageUploadError

);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;