// ======================================================
// FILE: projectRoutes.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Defines all Project API routes.
//
// RESPONSIBILITIES:
// • Create project
// • Update project
// • Delete project
// • Upload project images
// • Get project statistics
// • Get all projects
// • Get single project by slug
//
// AUTHOR:
// Joel Butala
// ======================================================

import express from "express";

import {
    createProject,
    updateProject,
    deleteProject,
    getProjectStats,
    getProjects,
    getProjectBySlug,
} from "../controllers/projectController.js";

import upload, { uploadLimits } from "../config/multer.js";
import { protect } from "../middleware/authMiddleware.js";
import {
    handleImageUploadError,
    validateImageUploads,
} from "../middleware/imageUploadMiddleware.js";

const router = express.Router();


// ======================================================
// CREATE PROJECT
//
// POST /api/projects
//
// FILES:
// • heroImage     = 1 image
// • beforeImages  = 4 images
// • afterImages   = 4 images
// ======================================================

router.post(

    "/",

    protect,

    upload.fields([

        {
            name: "heroImage",
            maxCount: 1,
        },

        {
            name: "beforeImages",
            maxCount: uploadLimits.projectGalleryImages,
        },

        {
            name: "afterImages",
            maxCount: uploadLimits.projectGalleryImages,
        },

    ]),

    validateImageUploads,

    createProject,

    handleImageUploadError

);


// ======================================================
// UPDATE PROJECT
//
// PUT /api/projects/:id
//
// PURPOSE:
// Update an existing project.
//
// CAN UPDATE:
// • Project information
// • Project status
// • Project value
// • Hero image
// • Before images
// • After images
// ======================================================

router.put(

    "/:id",

    protect,

    upload.fields([

        {
            name: "heroImage",
            maxCount: 1,
        },

        {
            name: "beforeImages",
            maxCount: uploadLimits.projectGalleryImages,
        },

        {
            name: "afterImages",
            maxCount: uploadLimits.projectGalleryImages,
        },

    ]),

    validateImageUploads,

    updateProject,

    handleImageUploadError

);


// ======================================================
// DELETE PROJECT
//
// DELETE /api/projects/:id
//
// PURPOSE:
// Permanently delete an existing project.
//
// ALSO REMOVES:
// • Hero image
// • Before images
// • After images
// ======================================================

router.delete(

    "/:id",

    protect,

    deleteProject

);


// ======================================================
// GET PROJECT STATISTICS
//
// GET /api/projects/stats
//
// RETURNS:
// • totalProjects
// • activeProjects
// • pendingProjects
// • completedProjects
// • revenue
//
// IMPORTANT:
// This route MUST appear before:
//
// /:slug
//
// Otherwise Express could interpret "stats"
// as a project slug.
// ======================================================

router.get(

    "/stats",

    protect,

    getProjectStats

);


// ======================================================
// GET ALL PROJECTS
//
// GET /api/projects
//
// Supports:
// • Pagination
// • Category filtering
// ======================================================

router.get(

    "/",

    getProjects

);


// ======================================================
// GET PROJECT BY SLUG
//
// GET /api/projects/:slug
// ======================================================

router.get(

    "/:slug",

    getProjectBySlug

);


export default router;