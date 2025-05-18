import { v2 as cloudinaryV2 } from "cloudinary";

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = "profileImages"
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    cloudinaryV2.uploader.upload(
      filePath,
      {
        folder,
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );
  });
};

export default cloudinaryV2;
