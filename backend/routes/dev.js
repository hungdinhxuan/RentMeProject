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
const { v4: uuidv4 } = require('uuid');
const { multer } = require('../utils/config');
const multerLib = require('multer');
const fs = require('fs');
const streamifier = require('streamifier');

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

    //Check if files exist
    if (!req.files)
      return res.status(400).json({ message: 'No picture attached!' });
    //map through images and create a promise array using cloudinary upload function

    let uploadFromBuffer = (file, id) => {

      return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
         {
          upload_preset: "rentme",
           filename_override: `${id}_albums`
         },
         (error, result) => {
   
           if (result) {
             resolve(result);
           } else {
             reject(error);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
      });
   
   };
    try {      
      let multiplePicturePromise = req.files.map((file) => uploadFromBuffer(file, req.body.id));
      let imageResponses = await Promise.all(multiplePicturePromise);
      console.log(`Uploaded ${imageResponses.length}`);
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
      return res
        .status(400)
        .json({ success: false, message: 'No picture attached!' });
    //map through images and create a promise array using cloudinary upload function
    // try {
    //   const { id } = req.body;
    //   let uploadResponse = await cloudinary.uploader.upload(req.file.path, {
    //       unique_filename: false,
    //       upload_preset: 'rentme',
    //       filename_override: `${id}_avatar`,
    //     });

    //   res.json({success: true, message: 'Upload successful', image: uploadResponse });
    // } catch (error) {
    //   return res.status(500).send(error);
    // }
    const { id } = req.body;
    function cloudinaryDone(error, result) {
      if (error) {
        console.log('Error in cloudinary.uploader.upload_stream\n', error);
        return res
          .status(500)
          .json({
            success: false,
            message: 'Error in cloudinary.uploader.upload_stream',
          });
      }
      console.log(result);
      return res.json({ success: true, file: result });
    }
    // console.log(req.file);
    cloudinary.uploader
      .upload_stream(
        {
          upload_preset: 'rentme',
          filename_override: `${id}_avatar`,
          unique_filename: false,
        },
        cloudinaryDone,
      )
      .end(req.file.buffer);
  });
});

router.post('/upload-video', (req, res) => {});

router.post('/upload-audio', (req, res) => {});

module.exports = router;
