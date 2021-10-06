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
const streamifier = require('streamifier');
const validate = require('../middleware/validate');
const User = require('../models/users');

router.get('/', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  return res.send('ok');
});

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
            upload_preset: 'rentme',
            filename_override: `${id}_albums`,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );
        streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
      });
    };
    try {
      let multiplePicturePromise = req.files.map((file) =>
        uploadFromBuffer(file, req.body.id),
      );
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
    const { id } = req.body;
    function cloudinaryDone(error, result) {
      if (error) {
        console.log('Error in cloudinary.uploader.upload_stream\n', error);
        return res.status(500).json({
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

// nickname: { type: String, require: true },
//     shortDesc: { type: String, default: '', maxLength: 255, required: true},
//     longDesc: { type: String, default: '', maxLength: 2000 },
//     userId: { type: mongoose.Types.ObjectId, refs: 'users' },
//     coverBackground: { type: String, required: true},
//     pricePerHour: { type: Number },
//     recordVoiceUrl: { type: String, default: '' },
//     albums: [String],
//     timeCanReceive: [Number],
//     status: {
//       type: String,
//       default: 'Under Review',
//       enum: ['Accepted', 'Rejected', 'Under Review'],
//     },
router.post('/generate-sample-profile-player', async (req, res) => {
  const max_results = 50 * 4;

  try {
    const res = await cloudinary.search
      .expression(
        'rentme-sample-data/girlxinhpro/*', // add your folder
      )
      .sort_by('public_id', 'desc')
      .max_results(max_results)
      .execute();
    const { resources } = result;
    // const player_profiles
    for (let index = 0; index < resources.length; index += 4) {
      let coverBackground = resources[index].secure_url;
      let albums = [
        resources[index + 1].secure_url,
        resources[index + 2].secure_url,
        resources[index + 3].secure_url,
      ];
    }
    res.send(result);
  } catch (error) {
    res.send(err);
  }
});

module.exports = router;
