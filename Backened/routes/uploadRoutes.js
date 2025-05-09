const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();

require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify Cloudinary configuration
cloudinary.api.ping()
  .then(result => {
    console.log('Cloudinary connection successful:', result);
  })
  .catch(error => {
    console.error('Cloudinary connection failed:', error);
  });

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File received:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // function to upload the file to Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'fashion-mart',
                        resource_type: 'auto'
                    },
                    (error, result) => {
                        if (result) {
                            console.log('Upload successful:', result.secure_url);
                            resolve(result);
                        } else {
                            console.error('Upload failed:', error);
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);

        res.json({
            success: true,
            imageUrl: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
});

module.exports = router;
