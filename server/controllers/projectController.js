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

import uploadBufferToCloudinary from "../utils/cloudinaryUpload.js";

import deleteImageFromCloudinary from "../utils/cloudinaryDelete.js";


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
                globalThis.process.cwd(),
                relativePath
            );


        await fs.unlink(filePath);
        return true;


    } catch (error) {

        // File cleanup should never cause the
        // main database operation to fail.

        if (error.code === "ENOENT") {
            return true;
        }

        console.warn("Unable to delete local image file:", imagePath, error.message);
        return false;

    }

};

// ======================================================
// HELPER: DELETE STORED IMAGE
//
// Supports both:
// • Old local /uploads images
// • New Cloudinary images
// ======================================================

const deleteStoredImage = async (imageUrl) => {

    if (!imageUrl) {
        return;
    }

    if (
        imageUrl.includes(
            "res.cloudinary.com"
        )
    ) {

        return await deleteImageFromCloudinary(
            imageUrl
        );

    }

    return await deleteImageFile(
        imageUrl
    );

};

const uploadAndTrack = async (file, folder, uploadedImages) => {
    const result = await uploadBufferToCloudinary(file.buffer, folder);

    if (!result?.secure_url) {
        throw new Error("Cloudinary did not return a secure image URL.");
    }

    uploadedImages.push(result.secure_url);
    return result.secure_url;
};

const cleanupUploadedImages = async (imageUrls, context) => {
    for (const imageUrl of imageUrls) {
        try {
            const deleted = await deleteStoredImage(imageUrl);
            if (deleted === false) {
                console.error(
                    `Failed to clean up project image after ${context}:`,
                    imageUrl
                );
            }
        } catch (error) {
            console.error(
                `Failed to clean up newly uploaded project image after ${context}:`,
                error.message
            );
        }
    }
};

const cleanupReplacedImages = async (
    imageUrls,
    projectId,
    context = "update"
) => {
    for (const imageUrl of imageUrls.filter(Boolean)) {
        try {
            const deleted = await deleteStoredImage(imageUrl);
            if (deleted === false) {
                console.error(
                    `Project ${projectId} was saved, but image cleanup failed after ${context}:`,
                    imageUrl
                );
            }
        } catch (error) {
            console.error(
                `Project ${projectId} was saved, but image cleanup failed after ${context}:`,
                error.message
            );
        }
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

    const uploadedImages = [];
    let projectSaved = false;

    try {


        // ==================================================
// HERO IMAGE
// ==================================================

let heroImage = "";

if (req.files?.heroImage?.[0]) {

    heroImage = await uploadAndTrack(
        req.files.heroImage[0],
        "concrete-finisher/projects",
        uploadedImages
    );

}

// ==================================================
// BEFORE IMAGES
// ==================================================

let beforeImages = [];

if (req.files?.beforeImages) {

    for (const image of req.files.beforeImages) {
        beforeImages.push(
            await uploadAndTrack(
                image,
                "concrete-finisher/projects/before",
                uploadedImages
            )
        );
    }

}


// ==================================================
// AFTER IMAGES
// ==================================================

let afterImages = [];

if (req.files?.afterImages) {

    for (const image of req.files.afterImages) {
        afterImages.push(
            await uploadAndTrack(
                image,
                "concrete-finisher/projects/after",
                uploadedImages
            )
        );
    }

}

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

        projectSaved = true;

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

        if (!projectSaved) {
            await cleanupUploadedImages(uploadedImages, "project creation failure");
        }

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

    const uploadedImages = [];
    const replacedImages = [];
    let projectSaved = false;

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
// New hero image is uploaded to Cloudinary.
// Existing image is deleted only after the new
// image has uploaded successfully.
// ==================================================

if (req.files?.heroImage?.[0]) {

    const newHeroImage = await uploadAndTrack(
        req.files.heroImage[0],
        "concrete-finisher/projects",
        uploadedImages
    );

    replacedImages.push(project.heroImage || project.image);

    // Save new image
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
// Replaces the existing before gallery.
// ==================================================

if (
    req.files?.beforeImages?.length
) {

    // Upload new images FIRST
    // so we don't destroy the old gallery
    // if Cloudinary upload fails.

    const newBeforeImages = [];
    for (const image of req.files.beforeImages) {
        newBeforeImages.push(
            await uploadAndTrack(
                image,
                "concrete-finisher/projects/before",
                uploadedImages
            )
        );
    }


    // Delete old gallery
    if (
        Array.isArray(
            project.beforeImages
        )
    ) {

        for (
            const image of
            project.beforeImages
        ) {

            replacedImages.push(image);

        }

    }


    // Save new gallery
    project.beforeImages =
        newBeforeImages;

}


// ==================================================
// AFTER IMAGES UPDATE
//
// Replaces the existing after gallery.
// ==================================================

if (
    req.files?.afterImages?.length
) {

    // Upload new images FIRST

    const newAfterImages = [];
    for (const image of req.files.afterImages) {
        newAfterImages.push(
            await uploadAndTrack(
                image,
                "concrete-finisher/projects/after",
                uploadedImages
            )
        );
    }


    // Delete old gallery
    if (
        Array.isArray(
            project.afterImages
        )
    ) {

        for (
            const image of
            project.afterImages
        ) {

            replacedImages.push(image);

        }

    }


    // Save new gallery
    project.afterImages =
        newAfterImages;

}


        // ==================================================
        // SAVE UPDATED PROJECT
        // ==================================================

        const updatedProject =
            await project.save();

        projectSaved = true;
        await cleanupReplacedImages(replacedImages, project._id);

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

        if (!projectSaved) {
            await cleanupUploadedImages(uploadedImages, "project update failure");
        }

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
        // DELETE PROJECT FROM DATABASE
        // ==================================================

        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        await cleanupReplacedImages(
            [
                deletedProject.heroImage || deletedProject.image,
                ...(deletedProject.beforeImages || []),
                ...(deletedProject.afterImages || []),
            ],
            deletedProject._id,
            "project deletion"
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