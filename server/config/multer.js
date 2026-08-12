// ======================================================
// FILE: multer.js
//
// PROJECT:
// Concrete Finisher Uganda Website
//
// PURPOSE:
// Handles image uploads for projects.
//
// AUTHOR:
// Joel Butala
// ======================================================

import multer from "multer";

import fs from "fs";

import path from "path";



// ======================================================
// STORAGE
// ======================================================

const storage = multer.diskStorage({

    destination(req, file, cb) {

        const uploadPath = path.join("uploads", "projects");

        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(uploadPath, {

                recursive: true,

            });

        }

        cb(null, uploadPath);

    },



    filename(req, file, cb) {

        const uniqueName =

            Date.now() +

            "-" +

            file.originalname.replace(/\s+/g, "-");

        cb(null, uniqueName);

    },

});



// ======================================================
// EXPORT MULTER
// ======================================================

const upload = multer({

    storage,

});



export default upload;