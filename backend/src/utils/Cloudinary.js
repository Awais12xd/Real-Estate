import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {string} localFilePath - Absolute path to local file
 * @param {string} folder - Optional Cloudinary folder (e.g., "user_profiles")
 * @returns {Object|null} - Cloudinary upload response or null on failure
 */
const uploadOnCloudinary = async (localFilePath, folder = 'uploads') => {
  if (!localFilePath) {
    console.log("No file path provided!");
    return null;
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder, // store images in a meaningful Cloudinary folder
    });

   
    fs.unlinkSync(localFilePath); // Clean up temp file

    return {
      secure_url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    console.error("❌ Upload error:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

/**
 * Delete a file from Cloudinary by public ID
 * @param {string} publicId - Cloudinary public ID
 * @returns {boolean} - true on success, false on failure
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    console.log("⚠️ No publicId provided for deletion.");
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("🗑️ Deleted from Cloudinary:", publicId);
    return result.result === "ok" || result.result === "not found";
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error);
    return false;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
