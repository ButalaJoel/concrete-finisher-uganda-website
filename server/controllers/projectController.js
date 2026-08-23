// ======================================================
// FILE: projectController.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles Project API operations.
//
// RESPONSIBILITIES:
// • Create project
// • Update project
// • Delete project
// • Handle project image uploads
// • Get paginated projects
// • Filter projects by category
// • Get project statistics
// • Search projects
// • Get single project by slug
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import Project from "../models/Project.js";

import fs from "fs/promises";

import path from "path";


// ======================================================
// HELPER: DELETE IMAGE FILE
//
// Used when:
// • A project is deleted
// • A hero image is replaced
//
// If the file does not exist, the operation simply
// continues instead of breaking the request.
// ======================================================

const deleteImageFile = async (imagePath) => {

    try {

        if (!imagePath) {

            return;

        }


        // Remove the leading "/" from paths such as:
        //
        // /uploads/projects/example.jpg
        //
        const relativePath =
            imagePath.replace(/^[/\\]/, "");


        const filePath =
            path.join(
                process.cwd(),
                relativePath
            );


        await fs.unlink(filePath);


    } catch (error) {

        // File cleanup should never cause the
        // main database operation to fail.

        console.warn(
            "Unable to delete image file:",
            imagePath
        );

    }

};


// ======================================================
// CREATE PROJECT
//
// POST /api/projects
//
// FILES:
// • heroImage    → 1 image
// • beforeImages → up to 4 images
// • afterImages  → up to 4 images
//
// ======================================================

export const createProject = async (req, res) => {

    try {


        // ==================================================
        // HERO IMAGE
        // ==================================================

        const heroImage =
            req.files?.heroImage
                ? `/uploads/projects/${req.files.heroImage[0].filename}`
                : "";


        // ==================================================
        // BEFORE IMAGES
        // ==================================================

        const beforeImages =
            req.files?.beforeImages
                ? req.files.beforeImages.map(
                    (image) =>
                        `/uploads/projects/${image.filename}`
                )
                : [];


        // ==================================================
        // AFTER IMAGES
        // ==================================================

        const afterImages =
            req.files?.afterImages
                ? req.files.afterImages.map(
                    (image) =>
                        `/uploads/projects/${image.filename}`
                )
                : [];


        // ==================================================
        // CREATE PROJECT
        // ==================================================

        const project =
            await Project.create({

                ...req.body,

                // Hero image
                heroImage,

                // Keep image field for the existing
                // public website frontend.
                image: heroImage,

                // Before gallery
                beforeImages,

                // After gallery
                afterImages,

            });


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        res.status(201).json({

            success: true,

            message:
                "Project created successfully.",

            data: project,

        });


    } catch (error) {


        console.error(
            "Create project error:",
            error
        );


        // ==================================================
        // DUPLICATE SLUG
        // ==================================================

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "A project with this slug already exists.",

            });

        }


        // ==================================================
        // VALIDATION ERROR
        // ==================================================

        if (error.name === "ValidationError") {

            return res.status(400).json({

                success: false,

                message:
                    "Please check the project information and try again.",

                errors:
                    Object.values(error.errors).map(
                        (item) => item.message
                    ),

            });

        }


        // ==================================================
        // GENERAL ERROR
        // ==================================================

        res.status(500).json({

            success: false,

            message:
                "Unable to create project.",

        });

    }

};


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
// • Status
// • Project value
// • Hero image
// • Before images
// • After images
//
// IMPORTANT:
// Existing images are kept unless new images are
// uploaded for that particular image section.
// ======================================================

export const updateProject = async (req, res) => {

    try {


        // ==================================================
        // FIND PROJECT
        // ==================================================

        const project =
            await Project.findById(
                req.params.id
            );


        // ==================================================
        // PROJECT NOT FOUND
        // ==================================================

        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found.",

            });

        }


        // ==================================================
        // UPDATE TEXT / FORM FIELDS
        //
        // Only fields that actually belong to the
        // Project model are updated.
        // ==================================================

        const allowedFields = [

            "slug",

            "title",

            "category",

            "service",

            "client",

            "location",

            "industry",

            "surfaceArea",

            "completionTime",

            "system",

            "status",

            "projectValue",

            "shortDescription",

            "overview",

            "challenge",

            "solution",

        ];


        allowedFields.forEach((field) => {

            if (
                req.body[field] !== undefined
            ) {

                project[field] =
                    req.body[field];

            }

        });


        // ==================================================
        // HERO IMAGE UPDATE
        //
        // Only replace the existing hero image when
        // a new image was uploaded.
        // ==================================================

        if (req.files?.heroImage) {


            const newHeroImage =
                `/uploads/projects/${req.files.heroImage[0].filename}`;


            // Delete old hero image
            await deleteImageFile(
                project.heroImage
            );


            // Save new hero image
            project.heroImage =
                newHeroImage;


            // Keep public website image field
            // synchronized.
            project.image =
                newHeroImage;

        }


        // ==================================================
        // BEFORE IMAGES UPDATE
        //
        // If new before images are uploaded,
        // replace the existing before gallery.
        // ==================================================

        if (req.files?.beforeImages) {


            // Delete old before images

            if (
                Array.isArray(
                    project.beforeImages
                )
            ) {

                for (
                    const image of
                    project.beforeImages
                ) {

                    await deleteImageFile(
                        image
                    );

                }

            }


            // Create new before image paths

            project.beforeImages =
                req.files.beforeImages.map(
                    (image) =>
                        `/uploads/projects/${image.filename}`
                );

        }


        // ==================================================
        // AFTER IMAGES UPDATE
        //
        // If new after images are uploaded,
        // replace the existing after gallery.
        // ==================================================

        if (req.files?.afterImages) {


            // Delete old after images

            if (
                Array.isArray(
                    project.afterImages
                )
            ) {

                for (
                    const image of
                    project.afterImages
                ) {

                    await deleteImageFile(
                        image
                    );

                }

            }


            // Create new after image paths

            project.afterImages =
                req.files.afterImages.map(
                    (image) =>
                        `/uploads/projects/${image.filename}`
                );

        }


        // ==================================================
        // SAVE UPDATED PROJECT
        // ==================================================

        const updatedProject =
            await project.save();


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            message:
                "Project updated successfully.",

            data:
                updatedProject,

        });


    } catch (error) {


        console.error(
            "Update project error:",
            error
        );


        // ==================================================
        // DUPLICATE SLUG
        // ==================================================

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "A project with this slug already exists.",

            });

        }


        // ==================================================
        // INVALID PROJECT ID
        // ==================================================

        if (
            error.name ===
            "CastError"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid project ID.",

            });

        }


        // ==================================================
        // VALIDATION ERROR
        // ==================================================

        if (
            error.name ===
            "ValidationError"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please check the project information and try again.",

                errors:
                    Object.values(error.errors).map(
                        (item) => item.message
                    ),

            });

        }


        // ==================================================
        // GENERAL ERROR
        // ==================================================

        res.status(500).json({

            success: false,

            message:
                "Unable to update project.",

        });

    }

};


// ======================================================
// DELETE PROJECT
//
// DELETE /api/projects/:id
//
// PURPOSE:
// Permanently removes a project from MongoDB.
//
// ALSO REMOVES:
// • Hero image
// • Before images
// • After images
//
// ======================================================

export const deleteProject = async (req, res) => {

    try {


        // ==================================================
        // FIND PROJECT
        // ==================================================

        const project =
            await Project.findById(
                req.params.id
            );


        // ==================================================
        // PROJECT NOT FOUND
        // ==================================================

        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found.",

            });

        }


        // ==================================================
        // DELETE HERO IMAGE
        // ==================================================

        await deleteImageFile(
            project.heroImage
        );


        // ==================================================
        // DELETE BEFORE IMAGES
        // ==================================================

        if (
            Array.isArray(
                project.beforeImages
            )
        ) {

            for (
                const image of
                project.beforeImages
            ) {

                await deleteImageFile(
                    image
                );

            }

        }


        // ==================================================
        // DELETE AFTER IMAGES
        // ==================================================

        if (
            Array.isArray(
                project.afterImages
            )
        ) {

            for (
                const image of
                project.afterImages
            ) {

                await deleteImageFile(
                    image
                );

            }

        }


        // ==================================================
        // DELETE PROJECT FROM DATABASE
        // ==================================================

        await Project.findByIdAndDelete(
            req.params.id
        );


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            message:
                "Project deleted successfully.",

        });


    } catch (error) {


        console.error(
            "Delete project error:",
            error
        );


        // ==================================================
        // INVALID PROJECT ID
        // ==================================================

        if (
            error.name ===
            "CastError"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid project ID.",

            });

        }


        // ==================================================
        // GENERAL ERROR
        // ==================================================

        res.status(500).json({

            success: false,

            message:
                "Unable to delete project.",

        });

    }

};


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
// ======================================================

export const getProjectStats = async (req, res) => {

    try {


        // ==================================================
        // TOTAL PROJECTS
        // ==================================================

        const totalProjects =
            await Project.countDocuments();


        // ==================================================
        // ACTIVE PROJECTS
        // ==================================================

        const activeProjects =
            await Project.countDocuments({

                status: "Active",

            });


        // ==================================================
        // PENDING PROJECTS
        // ==================================================

        const pendingProjects =
            await Project.countDocuments({

                status: "Pending",

            });


        // ==================================================
        // COMPLETED PROJECTS
        // ==================================================

        const completedProjects =
            await Project.countDocuments({

                status: "Completed",

            });


        // ==================================================
        // REVENUE
        // ==================================================

        const revenueResult =
            await Project.aggregate([

                {

                    $match: {

                        projectValue: {

                            $type: "number",

                        },

                    },

                },

                {

                    $group: {

                        _id: null,

                        totalRevenue: {

                            $sum:
                                "$projectValue",

                        },

                    },

                },

            ]);


        // ==================================================
        // EXTRACT REVENUE
        // ==================================================

        const revenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            data: {

                totalProjects,

                activeProjects,

                pendingProjects,

                completedProjects,

                revenue,

            },

        });


    } catch (error) {


        console.error(
            "Get project statistics error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to retrieve project statistics.",

        });

    }

};


// ======================================================
// GET PROJECTS
//
// GET /api/projects
//
// SUPPORTS:
// • Pagination
// • Category filtering
// • Project search
//
// ======================================================

export const getProjects = async (req, res) => {

    try {


        // ==================================================
        // CURRENT PAGE
        // ==================================================

        const page =
            Math.max(

                parseInt(
                    req.query.page
                ) || 1,

                1

            );


        // ==================================================
        // PROJECTS PER PAGE
        // ==================================================

        const limit =
            Math.max(

                parseInt(
                    req.query.limit
                ) || 3,

                1

            );


        // ==================================================
        // CALCULATE SKIP
        // ==================================================

        const skip =
            (page - 1) * limit;


        // ==================================================
// CATEGORY FILTER
// ==================================================

const category =
    req.query.category;


// ==================================================
// SEARCH QUERY
//
// Example:
//
// /api/projects?search=kampala
//
// The frontend sends the text entered by the
// administrator through the "search" query parameter.
// ==================================================

const search =
    req.query.search?.trim();


// ==================================================
// BUILD DATABASE FILTER
//
// We start with an empty filter object.
//
// Then we add category filtering and/or search
// conditions depending on what the administrator
// requested.
// ==================================================

const filter = {};


// ==================================================
// APPLY CATEGORY FILTER
// ==================================================

if (
    category &&
    category !== "All Projects"
) {

    filter.category =
        category;

}


// ==================================================
// APPLY PROJECT SEARCH
//
// $or means:
// Return a project if ANY of these fields match.
//
// $regex allows partial text searching.
//
// $options: "i" makes the search case-insensitive.
//
// Example:
//
// Searching "epoxy" will match:
//
// "Epoxy Flooring"
//
// "Industrial Epoxy Project"
//
// "EPOXY Flooring"
// ==================================================

if (search) {

    filter.$or = [

        {
            title: {
                $regex: search,
                $options: "i",
            },
        },

        {
            client: {
                $regex: search,
                $options: "i",
            },
        },

        {
            location: {
                $regex: search,
                $options: "i",
            },
        },

        {
            category: {
                $regex: search,
                $options: "i",
            },
        },

        {
            service: {
                $regex: search,
                $options: "i",
            },
        },

        {
            status: {
                $regex: search,
                $options: "i",
            },
        },

    ];

}

        // ==================================================
        // COUNT TOTAL PROJECTS
        // ==================================================

        const totalProjects =
            await Project.countDocuments(
                filter
            );


        // ==================================================
        // GET PROJECTS
        // ==================================================

        const projects =
            await Project.find(filter)

                .sort({

                    createdAt: -1,

                })

                .skip(skip)

                .limit(limit);


        // ==================================================
        // CALCULATE TOTAL PAGES
        // ==================================================

        const totalPages =
            Math.ceil(
                totalProjects / limit
            );


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            data: projects,

            pagination: {

                currentPage:
                    page,

                totalPages:
                    totalPages,

                totalProjects:
                    totalProjects,

                limit:
                    limit,

                hasNextPage:
                    page < totalPages,

                hasPreviousPage:
                    page > 1,

            },

        });


    } catch (error) {


        console.error(
            "Get projects error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to retrieve projects.",

        });

    }

};


// ======================================================
// GET PROJECT BY SLUG
//
// GET /api/projects/:slug
//
// ======================================================

export const getProjectBySlug = async (
    req,
    res
) => {

    try {


        // ==================================================
        // FIND PROJECT
        // ==================================================

        const project =
            await Project.findOne({

                slug:
                    req.params.slug,

            });


        // ==================================================
        // PROJECT NOT FOUND
        // ==================================================

        if (!project) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found.",

            });

        }


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            data: project,

        });


    } catch (error) {


        console.error(
            "Get project error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to retrieve project.",

        });

    }

};