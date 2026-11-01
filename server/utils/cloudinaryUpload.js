import { Readable } from "stream";

import cloudinary from "./cloudinary.js";


// ======================================================
// UPLOAD BUFFER TO CLOUDINARY
// ======================================================

const uploadBufferToCloudinary = (
    buffer,
    folder
) => {

    return new Promise(
        (resolve, reject) => {

            if (!globalThis.Buffer.isBuffer(buffer) || !folder) {
                reject(new TypeError("A valid image buffer and Cloudinary folder are required."));
                return;
            }

            const uploadStream =
                cloudinary.uploader.upload_stream(

                    {
                        folder,
                        resource_type: "image",
                    },

                    (error, result) => {

                        if (error) {

                            reject(error);

                            return;

                        }

                        if (!result?.secure_url || !result.public_id) {
                            reject(new Error("Cloudinary returned an incomplete upload result."));
                            return;
                        }

                        resolve(result);

                    }

                );


            const source = Readable.from([buffer]);
            source.once("error", reject);
            uploadStream.once("error", reject);
            source.pipe(uploadStream);

        }
    );

};


export default uploadBufferToCloudinary;