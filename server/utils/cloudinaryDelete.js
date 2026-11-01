import cloudinary from "./cloudinary.js";


// ======================================================
// DELETE IMAGE FROM CLOUDINARY
// ======================================================

const deleteImageFromCloudinary = async (
    imageUrl
) => {

    try {

        if (!imageUrl) {
            return;
        }


        // ==================================================
        // EXTRACT CLOUDINARY PATH
        // ==================================================

        const url =
            new URL(imageUrl);

        let publicId = url.pathname.split("/image/upload/")[1];


        if (!publicId) {
            console.warn("Unable to delete Cloudinary image: public ID was not found in the URL.");
            return false;
        }


        // Remove Cloudinary version
        publicId =
            publicId.replace(
                /^v\d+\//,
                ""
            );


        // Remove file extension
        publicId =
            publicId.replace(
                /\.[^/.]+$/,
                ""
            );


        // ==================================================
        // DELETE IMAGE
        // ==================================================

        const result = await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image",
            }
        );

        if (result?.result !== "ok" && result?.result !== "not found") {
            console.warn(
                "Cloudinary image deletion did not confirm success:",
                result?.result || "unknown result"
            );
            return false;
        }

        return result.result === "ok";


    } catch (error) {

        console.warn(
            "Unable to delete Cloudinary image:",
            error.message
        );
        return false;

    }

};


export default deleteImageFromCloudinary;