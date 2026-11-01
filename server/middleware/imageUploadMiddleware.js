import fs from "node:fs/promises";

const imageTypes = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
]);

export class ImageUploadError extends Error {
    constructor(code) {
        super(code);
        this.name = "ImageUploadError";
        this.code = code;
    }
}

export const getImageExtension = (mimeType) => imageTypes.get(mimeType);

export const imageFileFilter = (req, file, callback) => {
    if (!imageTypes.has(file.mimetype)) {
        callback(new ImageUploadError("UNSUPPORTED_FORMAT"));
        return;
    }

    callback(null, true);
};

const hasJpegContent = (buffer) => {
    if (buffer.length < 16 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
        return false;
    }

    let offset = 2;
    let hasFrame = false;

    while (offset < buffer.length) {
        while (buffer[offset] === 0xff) {
            offset += 1;
        }

        const marker = buffer[offset];
        offset += 1;

        if (marker === 0xd9) {
            return false;
        }

        if (
            marker === 0xd8 ||
            marker === 0x01 ||
            (marker >= 0xd0 && marker <= 0xd7)
        ) {
            continue;
        }

        if (offset + 2 > buffer.length) {
            return false;
        }

        const segmentLength = buffer.readUInt16BE(offset);

        if (segmentLength < 2 || offset + segmentLength > buffer.length) {
            return false;
        }

        if (
            (marker >= 0xc0 && marker <= 0xc3) ||
            (marker >= 0xc5 && marker <= 0xc7) ||
            (marker >= 0xc9 && marker <= 0xcb) ||
            (marker >= 0xcd && marker <= 0xcf)
        ) {
            if (segmentLength < 8) {
                return false;
            }

            const height = buffer.readUInt16BE(offset + 3);
            const width = buffer.readUInt16BE(offset + 5);

            if (width === 0 || height === 0) {
                return false;
            }

            hasFrame = true;
        }

        offset += segmentLength;

        if (marker === 0xda) {
            if (!hasFrame) {
                return false;
            }

            for (let index = offset; index + 1 < buffer.length; index += 1) {
                if (buffer[index] === 0xff && buffer[index + 1] === 0xd9) {
                    return true;
                }
            }

            return false;
        }
    }

    return false;
};

const crc32 = (buffer, start, end) => {
    let crc = 0xffffffff;

    for (let index = start; index < end; index += 1) {
        crc ^= buffer[index];

        for (let bit = 0; bit < 8; bit += 1) {
            crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
        }
    }

    return (crc ^ 0xffffffff) >>> 0;
};

const hasPngContent = (buffer) => {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    if (
        buffer.length < 45 ||
        !buffer.subarray(0, 8).equals(signature)
    ) {
        return false;
    }

    let offset = 8;
    let hasHeader = false;
    let hasImageData = false;
    let hasEnd = false;

    while (offset + 12 <= buffer.length) {
        const dataLength = buffer.readUInt32BE(offset);
        const typeStart = offset + 4;
        const dataStart = offset + 8;
        const crcStart = dataStart + dataLength;
        const chunkEnd = crcStart + 4;

        if (chunkEnd > buffer.length) {
            return false;
        }

        const chunkType = buffer.toString("ascii", typeStart, dataStart);
        const expectedCrc = buffer.readUInt32BE(crcStart);

        if (crc32(buffer, typeStart, crcStart) !== expectedCrc) {
            return false;
        }

        if (offset === 8) {
            if (chunkType !== "IHDR" || dataLength !== 13) {
                return false;
            }

            const width = buffer.readUInt32BE(dataStart);
            const height = buffer.readUInt32BE(dataStart + 4);

            if (width === 0 || height === 0) {
                return false;
            }

            hasHeader = true;
        } else if (chunkType === "IDAT" && dataLength > 0) {
            hasImageData = true;
        } else if (chunkType === "IEND") {
            if (dataLength !== 0 || chunkEnd !== buffer.length) {
                return false;
            }

            hasEnd = true;
            break;
        }

        offset = chunkEnd;
    }

    return hasHeader && hasImageData && hasEnd;
};

const hasWebpContent = (buffer) => {
    if (
        buffer.length < 30 ||
        buffer.toString("ascii", 0, 4) !== "RIFF" ||
        buffer.toString("ascii", 8, 12) !== "WEBP" ||
        buffer.readUInt32LE(4) !== buffer.length - 8
    ) {
        return false;
    }

    let offset = 12;
    let hasImageData = false;

    while (offset + 8 <= buffer.length) {
        const chunkType = buffer.toString("ascii", offset, offset + 4);
        const chunkLength = buffer.readUInt32LE(offset + 4);
        const dataStart = offset + 8;
        const chunkEnd = dataStart + chunkLength;
        const paddedEnd = chunkEnd + (chunkLength % 2);

        if (paddedEnd > buffer.length) {
            return false;
        }

        if (chunkType === "VP8 ") {
            hasImageData =
                chunkLength >= 10 &&
                (buffer[dataStart] & 1) === 0 &&
                buffer[dataStart + 3] === 0x9d &&
                buffer[dataStart + 4] === 0x01 &&
                buffer[dataStart + 5] === 0x2a &&
                (buffer.readUInt16LE(dataStart + 6) & 0x3fff) > 0 &&
                (buffer.readUInt16LE(dataStart + 8) & 0x3fff) > 0;
        } else if (chunkType === "VP8L") {
            hasImageData =
                chunkLength >= 5 &&
                buffer[dataStart] === 0x2f &&
                (buffer[dataStart + 4] & 0xe0) === 0;
        } else if (chunkType === "VP8X") {
            if (
                chunkLength < 10 ||
                (buffer[dataStart + 1] |
                    buffer[dataStart + 2] |
                    buffer[dataStart + 3]) !== 0
            ) {
                return false;
            }
        }

        if (hasImageData) {
            return true;
        }

        offset = paddedEnd;
    }

    return false;
};

const imageContentValidators = new Map([
    ["image/jpeg", hasJpegContent],
    ["image/png", hasPngContent],
    ["image/webp", hasWebpContent],
]);

const getUploadedFiles = (req) => {
    if (req.file) {
        return [req.file];
    }

    if (!req.files) {
        return [];
    }

    if (Array.isArray(req.files)) {
        return req.files;
    }

    return Object.values(req.files).flat();
};

const removeUploadedFiles = async (req) => {
    const files = getUploadedFiles(req);

    await Promise.all(
        files
            .filter((file) => file.path)
            .map(async (file) => {
                try {
                    await fs.rm(file.path, { force: true });
                } catch (error) {
                    console.error(
                        "Unable to remove rejected upload:",
                        error.name || "Error"
                    );
                }
            })
    );
};

export const validateImageUploads = async (req, res, next) => {
    try {
        for (const file of getUploadedFiles(req)) {
            const content = file.buffer || await fs.readFile(file.path);
            const validator = imageContentValidators.get(file.mimetype);

            if (!content.length || !validator?.(content)) {
                throw new ImageUploadError("INVALID_IMAGE_CONTENT");
            }
        }

        next();
    } catch (error) {
        await removeUploadedFiles(req);
        next(error);
    }
};

const uploadErrorMessages = {
    LIMIT_FILE_SIZE: "The image exceeds the maximum permitted file size.",
    LIMIT_FILE_COUNT: "Too many image files were uploaded.",
    LIMIT_UNEXPECTED_FILE: "Too many images or an unsupported image field was submitted.",
    LIMIT_FIELD_COUNT: "Too many form fields were submitted.",
    LIMIT_PART_COUNT: "Too many form fields or files were submitted.",
    UNSUPPORTED_FORMAT: "Unsupported image format. Upload a JPEG, PNG, or WebP image.",
    INVALID_IMAGE_CONTENT: "The uploaded file is empty, malformed, or does not match its declared image type.",
};

export const handleImageUploadError = (error, req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    const code = error instanceof ImageUploadError
        ? error.code
        : error.name === "MulterError"
            ? error.code
            : null;

    if (!code || !uploadErrorMessages[code]) {
        console.error(
            "Image upload request failed:",
            error.name || "Error"
        );
        res.status(500).json({
            message: "Unable to process the uploaded image.",
        });
        return;
    }

    res.status(400).json({
        message: uploadErrorMessages[code],
    });
};
