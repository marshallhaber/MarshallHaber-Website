const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

function uploadBuffer(buffer, fileName, folder = "marshall-admin", resourceType = "auto") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: folder },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url });
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = { uploadBuffer };
