// ======================================================
// FILE: Project.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// MongoDB model for Concrete Finisher projects.
//
// PROJECT STATUS:
// • Pending   → Project is approved but not currently
//              being worked on.
// • Active    → Project is currently being worked on.
// • Completed → Project has been fully completed.
//
// PROJECT VALUE:
// Stores the agreed project value in UGX.
//
// AUTHOR:
// Joel Butala
// ======================================================

import mongoose from "mongoose";


// ======================================================
// PROJECT SCHEMA
// ======================================================

const projectSchema = new mongoose.Schema({


    // ==================================================
    // BASIC PROJECT INFORMATION
    // ==================================================

    slug: {

        type: String,

        required: true,

        unique: true,

    },


    title: {

        type: String,

        required: true,

    },


    category: {

        type: String,

        required: true,

    },


    service: {

        type: String,

        required: true,

    },


    client: {

        type: String,

        required: true,

    },


    location: {

        type: String,

        required: true,

    },


    industry: {

        type: String,

        required: true,

    },


    // ==================================================
    // PROJECT DETAILS
    // ==================================================

    surfaceArea: {

        type: String,

    },


    completionTime: {

        type: String,

    },


    system: {

        type: String,

    },


    // ==================================================
    // PROJECT STATUS
    //
    // Pending:
    // Approved project that has not started or is
    // temporarily paused.
    //
    // Active:
    // Work is currently ongoing.
    //
    // Completed:
    // Project has been fully completed.
    // ==================================================

    status: {

        type: String,

        enum: [
            "Pending",
            "Active",
            "Completed",
        ],

        default: "Pending",

    },


    // ==================================================
    // PROJECT VALUE
    //
    // Stores the agreed project price in UGX.
    //
    // Example:
    //
    // 18500000
    //
    // This will later be used to calculate dashboard
    // revenue.
    // ==================================================

    projectValue: {

        type: Number,

        required: true,

        min: 0,

    },


    // ==================================================
    // PROJECT IMAGES
    // ==================================================

    image: {

        type: String,

    },


    heroImage: {

        type: String,

    },


    // ==================================================
    // PROJECT DESCRIPTIONS
    // ==================================================

    shortDescription: {

        type: String,

    },


    overview: {

        type: String,

    },


    challenge: {

        type: String,

    },


    solution: {

        type: String,

    },


    // ==================================================
    // PRODUCTS USED
    // ==================================================

    products: [

        {

            name: String,

            purpose: String,

        },

    ],


    // ==================================================
    // BEFORE IMAGES
    // ==================================================

    beforeImages: [

        String,

    ],


    // ==================================================
    // AFTER IMAGES
    // ==================================================

    afterImages: [

        String,

    ],


},


    // ==================================================
    // TIMESTAMPS
    //
    // Automatically creates:
    //
    // createdAt
    // updatedAt
    // ==================================================

    {

        timestamps: true,

    }


);


// ======================================================
// MODEL
// ======================================================

const Project = mongoose.model(
    "Project",
    projectSchema
);


export default Project;