// ======================================================
// FILE: multer.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles image uploads.
//
// RESPONSIBILITIES:
// • Upload project images
// • Upload administrator profile photos
//
// AUTHOR:
// Joel Butala
// ======================================================


// ======================================================
// IMPORTS
// ======================================================

import multer from "multer";

import fs from "fs";

import path from "path";


// ======================================================
// PROJECT IMAGE STORAGE
//
// Upload location:
//
// server/uploads/projects
// ======================================================

const projectStorage = multer.diskStorage({

    destination(req, file, cb) {

        const uploadPath =
            path.join(
                "uploads",
                "projects"
            );

        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(
                uploadPath,
                {
                    recursive: true,
                }
            );

        }

        cb(
            null,
            uploadPath
        );

    },


    filename(req, file, cb) {

        const uniqueName =

            Date.now() +

            "-" +

            file.originalname.replace(
                /\s+/g,
                "-"
            );

        cb(
            null,
            uniqueName
        );

    },

});


// ======================================================
// PROFILE PHOTO STORAGE
//
// Upload location:
//
// server/uploads/profiles
// ======================================================

const profileStorage = multer.diskStorage({

    destination(req, file, cb) {

        const uploadPath =
            path.join(
                "uploads",
                "profiles"
            );

        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(
                uploadPath,
                {
                    recursive: true,
                }
            );

        }

        cb(
            null,
            uploadPath
        );

    },


    filename(req, file, cb) {

        const uniqueName =

            "profile-" +

            Date.now() +

            "-" +

            file.originalname.replace(
                /\s+/g,
                "-"
            );

        cb(
            null,
            uniqueName
        );

    },

});

// ======================================================
// COMPANY LOGO STORAGE
//
// Upload location:
//
// server/uploads/company
// ======================================================

const companyStorage = multer.diskStorage({

    destination(req, file, cb) {

        const uploadPath =
            path.join(
                "uploads",
                "company"
            );

        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(
                uploadPath,
                {
                    recursive: true,
                }
            );

        }

        cb(
            null,
            uploadPath
        );

    },


    filename(req, file, cb) {

        const uniqueName =

            "company-" +

            Date.now() +

            "-" +

            file.originalname.replace(
                /\s+/g,
                "-"
            );

        cb(
            null,
            uniqueName
        );

    },

});

// ======================================================
// PROJECT UPLOAD
// ======================================================

const upload = multer({

    storage: projectStorage,

});


// ======================================================
// PROFILE PHOTO UPLOAD
// ======================================================

const uploadProfile = multer({

    storage: profileStorage,

});


// ======================================================
// COMPANY LOGO UPLOAD
// ======================================================

const uploadCompanyLogo = multer({

    storage: companyStorage,

});


// ======================================================
// EXPORTS
// ======================================================

export {

    uploadProfile,

    uploadCompanyLogo,

};

export default upload;