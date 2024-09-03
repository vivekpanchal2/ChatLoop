import { v2 as cloudinary } from "cloudinary";

const deletFilesFromCloudinary = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds)) {
      throw new Error("publicIds must be an array of public_id strings");
    }

    const deletePromises = publicIds.map((public_id) =>
      cloudinary.uploader.destroy(public_id)
    );

    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error("Error deleting files from Cloudinary:", error);
    throw error;
  }
};

export default deletFilesFromCloudinary;
