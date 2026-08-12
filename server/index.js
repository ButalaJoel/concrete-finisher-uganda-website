// ======================================================
// FILE: index.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Starts the Express server and registers all API routes.
//
// RESPONSIBILITIES:
// • Connect to MongoDB
// • Configure middleware
// • Register API routes
// • Serve uploaded project images
// • Start Express server
//
// AUTHOR:
// Joel Butala
// ======================================================

import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import quotationRoutes from "./routes/quotationRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";


// ======================================================
// CONNECT TO DATABASE
// ======================================================

connectDB();


// ======================================================
// CREATE EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// FILE PATH SETUP
//
// Needed because this project uses ES modules.
// These variables allow Express to locate the
// server/uploads folder correctly.
// ======================================================

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


// ======================================================
// SERVE UPLOADED FILES
//
// Browser URL:
//
// /uploads/projects/image.jpg
//
// Physical location:
//
// server/uploads/projects/image.jpg
// ======================================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());


// ======================================================
// API ROUTES
// ======================================================


// ------------------------------------------
// QUOTATION ROUTES
//
// Base URL:
// /api/quotations
// ------------------------------------------

app.use(
    "/api/quotations",
    quotationRoutes
);


// ------------------------------------------
// PROJECT ROUTES
//
// Base URL:
// /api/projects
// ------------------------------------------

app.use(
    "/api/projects",
    projectRoutes
);


// ======================================================
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {

    res.send(
        "Concrete Finisher Backend is running."
    );

});


// ======================================================
// START SERVER
// ======================================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});