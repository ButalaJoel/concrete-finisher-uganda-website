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
// • Serve uploaded project and profile images
// • Start Express server
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================



import path from "path";

import {
    fileURLToPath
} from "url";

import express from "express";

import cors from "cors";

import dns from "dns";


// ======================================================
// DATABASE
// ======================================================
import dotenv from "dotenv";
import connectDB from "./config/db.js";


// ======================================================
// ROUTES
// ======================================================

import quotationRoutes from "./routes/quotationRoutes.js";

import quotationSettingRoutes from "./routes/quotationSettingRoutes.js";

import officialQuotationRoutes from "./routes/officialQuotationRoutes.js";

import projectRoutes from "./routes/projectRoutes.js";

import reportRoutes from "./routes/reportRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";

import companyRoutes from "./routes/companyRoutes.js";

import systemPreferenceRoutes from "./routes/systemPreferenceRoutes.js";

import authRoutes from "./routes/authRoutes.js";


dotenv.config();

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

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
//
// These variables allow Express to locate the
// server/uploads folder correctly.
// ======================================================

const __filename =
    fileURLToPath(
        import.meta.url
    );

const __dirname =
    path.dirname(
        __filename
    );


// ======================================================
// SERVE UPLOADED FILES
//
// Browser URLs:
//
// /uploads/projects/image.jpg
//
// /uploads/profiles/profile-image.jpg
//
// Physical locations:
//
// server/uploads/projects/image.jpg
//
// server/uploads/profiles/profile-image.jpg
// ======================================================

app.use(

    "/uploads",

    express.static(

        path.join(
            __dirname,
            "uploads"
        )

    )

);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
    cors()
);

app.use(
    express.json()
);


// ======================================================
// API ROUTES
// ======================================================


// ======================================================
// QUOTATION ROUTES
//
// Base URL:
//
// /api/quotations
// ======================================================

app.use(

    "/api/quotations",

    quotationRoutes

);

// ======================================================
// QUOTATION SETTINGS ROUTES
// ======================================================

app.use(
    "/api/quotation-settings",
    quotationSettingRoutes
);

app.use(
    "/api/official-quotations",
    officialQuotationRoutes
);


// ======================================================
// PROJECT ROUTES
//
// Base URL:
//
// /api/projects
// ======================================================

app.use(

    "/api/projects",

    projectRoutes

);


// ======================================================
// REPORT ROUTES
//
// Base URL:
//
// /api/reports
// ======================================================

app.use(

    "/api/reports",

    reportRoutes

);


// ======================================================
// ADMINISTRATOR ROUTES
//
// Base URL:
//
// /api/admin
//
// Available routes:
//
// GET /api/admin/profile
//
// PUT /api/admin/profile
// ======================================================

app.use(

    "/api/admin",

    adminRoutes

);


// ======================================================
// COMPANY ROUTES
//
// Base URL:
//
// /api/company
//
// Available routes:
//
// GET /api/company/profile
//
// PUT /api/company/profile
// ======================================================

app.use(
    "/api/company",
    companyRoutes
);

// ======================================================
// SYSTEM PREFERENCE ROUTES
//
// Base URL:
//
// /api/preferences
//
// Available routes:
//
// GET /api/preferences
// PUT /api/preferences
// ======================================================

app.use(
    "/api/preferences",
    systemPreferenceRoutes
);

// ======================================================
// AUTHENTICATION ROUTES
//
// Base URL:
//
// /api/auth
//
// Available routes:
//
// POST /api/auth/login
// PUT /api/auth/change-password
// ======================================================

app.use(
    "/api/auth",
    authRoutes
);




// ======================================================
// ROOT ROUTE
// ======================================================

app.get(

    "/",

    (req, res) => {

        res.send(
            "Concrete Finisher Backend is running."
        );

    }

);


// ======================================================
// START SERVER
// ======================================================

const PORT =
    process.env.PORT || 5000;

app.listen(

    PORT,

     "0.0.0.0",

    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }

);