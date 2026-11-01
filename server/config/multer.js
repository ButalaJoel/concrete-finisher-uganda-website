import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
    getImageExtension,
    imageFileFilter,
} from "../middleware/imageUploadMiddleware.js";

const parsePositiveInteger = (name, defaultValue) => {
    const rawValue = process.env[name];

    if (rawValue === undefined || rawValue === "") {
        return defaultValue;
    }

    const value = Number(rawValue);

    if (!Number.isSafeInteger(value) || value <= 0) {
        throw new Error(`${name} must be a positive whole number.`);
    }

    return value;
};

const megabytesToBytes = (name, defaultValue) => {
    const megabytes = parsePositiveInteger(name, defaultValue);
    const bytes = megabytes * 1024 * 1024;

    if (!Number.isSafeInteger(bytes)) {
        throw new Error(`${name} is too large.`);
    }

    return bytes;
};

export const uploadLimits = {
    projectImageBytes: megabytesToBytes("UPLOAD_PROJECT_IMAGE_MAX_MB", 10),
    profilePhotoBytes: megabytesToBytes("UPLOAD_PROFILE_PHOTO_MAX_MB", 5),
    companyLogoBytes: megabytesToBytes("UPLOAD_COMPANY_LOGO_MAX_MB", 5),
    projectGalleryImages: parsePositiveInteger(
        "UPLOAD_PROJECT_GALLERY_MAX_IMAGES",
        4
    ),
};

const createDiskStorage = (folder, filenamePrefix) => multer.diskStorage({
    destination(req, file, callback) {
        const uploadPath = path.join("uploads", folder);

        try {
            fs.mkdirSync(uploadPath, { recursive: true });
            callback(null, uploadPath);
        } catch (error) {
            callback(error);
        }
    },

    filename(req, file, callback) {
        callback(
            null,
            `${filenamePrefix}-${randomUUID()}.${getImageExtension(file.mimetype)}`
        );
    },
});

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: uploadLimits.projectImageBytes,
        files: 1 + uploadLimits.projectGalleryImages * 2,
    },
});

const uploadProfile = multer({
    storage: createDiskStorage("profiles", "profile"),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: uploadLimits.profilePhotoBytes,
        files: 1,
    },
});

const uploadCompanyLogo = multer({
    storage: createDiskStorage("company", "company"),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: uploadLimits.companyLogoBytes,
        files: 1,
    },
});

export {
    uploadProfile,
    uploadCompanyLogo,
};

export default upload;
