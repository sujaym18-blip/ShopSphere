import cloudinary from '../config/cloudinary.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

// Upload single image to Cloudinary
export const uploadToCloudinary = async (fileBuffer, folder = 'shopsphere') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(new ErrorResponse('Image upload failed', 500));
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new ErrorResponse('Image upload failed', 500);
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleToCloudinary = async (files, folder = 'shopsphere') => {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.buffer, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new ErrorResponse('Images upload failed', 500);
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new ErrorResponse('Image deletion failed', 500);
  }
};

// Delete multiple images from Cloudinary
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );
    await Promise.all(deletePromises);
  } catch (error) {
    throw new ErrorResponse('Images deletion failed', 500);
  }
};
