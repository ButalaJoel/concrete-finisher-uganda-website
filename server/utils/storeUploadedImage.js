import uploadBufferToCloudinary from "./cloudinaryUpload.js";

// ======================================================
// STORE AN UPLOADED IMAGE ON CLOUDINARY
//
// Company logos and profile photos used to be saved on
// the server's own disk. Hosting platforms wipe that disk
// on every restart, so they now go to Cloudinary like the
// project images. Returns the permanent https URL.
// ======================================================

const storeUploadedImage = async (file, folder) => {
    const result = await uploadBufferToCloudinary(
        file.buffer,
        `concrete-finisher/${folder}`
    );

    return result.secure_url;
};

export default storeUploadedImage;
