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

import upload from "../config/multer.js";

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

    upload.fields([

        {
            name: "heroImage",
            maxCount: 1,
        },

        {
            name: "beforeImages",
            maxCount: 4,
        },

        {
            name: "afterImages",
            maxCount: 4,
        },

    ]),

    createProject

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

    upload.fields([

        {
            name: "heroImage",
            maxCount: 1,
        },

        {
            name: "beforeImages",
            maxCount: 4,
        },

        {
            name: "afterImages",
            maxCount: 4,
        },

    ]),

    updateProject

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