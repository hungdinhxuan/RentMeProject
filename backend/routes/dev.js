const express = require('express');
const router = express.Router();
const {
  uploadAudiosS3,
  uploadImagesCloudinary,
  s3,
  bucket_name,
  uploadVideosCloudinary,
  cloudinary,
  upload,
} = require('../services/multer');

const { multer } = require('../utils/config');
const multerLib = require('multer');

router.post('/upload-images', (req, res) => {
  upload(
    multer.mimeTypes.image,
    multer.multerError.image,
    multer.multerFileSizeLimit,
  )
    .cloudinary()
    .array('images', multer.maxCount.images)(req, res, async (err) => {
    if (err instanceof multerLib.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);

      return res.status(400).json({
        success: false,
        err,
        //   message: "Tổng dung lượng file upload phải nhỏ hơn 10 MB",
        message: `File size limit exceeded please try again, file size must be <= ${multer.multerFileSizeLimit}`,
      });
    } else if (err) {
      // An unknown error occurred when uploading.

      console.log(err);
      return res.status(400).json({
        success: false,
        err,
        message: multer.multerError.image,
        // "Định dạng file không hợp lệ, Chỉ .png, .jpg và .jpeg được cho phép",
      });
    }
    let pictureFiles = req.files;
    //Check if files exist
    if (!pictureFiles)
      return res.status(400).json({ message: 'No picture attached!' });
    //map through images and create a promise array using cloudinary upload function
    try {
      const { id } = req.body;
      let multiplePicturePromise = pictureFiles.map((picture) =>
        cloudinary.uploader.upload(picture.path, {
          upload_preset: 'rentme',
          filename_override: `${id}_albums`,
        }),
      );
      let imageResponses = await Promise.all(multiplePicturePromise);
      res.json({ images: imageResponses });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
});

router.post('/upload-image', (req, res) => {
    upload(
        multer.mimeTypes.image,
        multer.multerError.image,
        multer.multerFileSizeLimit,
      )
        .cloudinary()
        .single('image')(req, res, async (err) => {
        if (err instanceof multerLib.MulterError) {
          // A Multer error occurred when uploading.
          console.log(err);
    
          return res.status(400).json({
            success: false,
            err,
            //   message: "Tổng dung lượng file upload phải nhỏ hơn 10 MB",
            message: `File size limit exceeded please try again, file size must be <= ${multer.multerFileSizeLimit}`,
          });
        } else if (err) {
          // An unknown error occurred when uploading.
    
          console.log(err);
          return res.status(400).json({
            success: false,
            err,
            message: multer.multerError.image,
            // "Định dạng file không hợp lệ, Chỉ .png, .jpg và .jpeg được cho phép",
          });
        }
        
        //Check if files exist
        if (!req.file)
          return res.status(400).json({success: false, message: 'No picture attached!' });
        //map through images and create a promise array using cloudinary upload function
        try {
          const { id } = req.body;
          let uploadResponse = await cloudinary.uploader.upload(req.file.path, {
              unique_filename: false,
              upload_preset: 'rentme',
              filename_override: `${id}_avatar`,
            });
          
          res.json({success: true, message: 'Upload successful', image: uploadResponse });
        } catch (error) {
          return res.status(500).send(error);
        }
      });
});

router.post('/upload-video', (req, res) => {});


router.post('/upload-audio', (req, res) => {});

module.exports = router;
