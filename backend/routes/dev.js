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
const PlayerProfiles = require('../models/player_profiles')
const argon2 = require('argon2');
const {girlName} = require('../init-data');

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
    let users = []
    const lengthName = girlName.length
    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    
    const avatarResult = await cloudinary.search
    .expression(
      'rentme-sample-avatar/*', // add your folder
    ).execute()
     
    for (let index = 0; index < max_results; index+=4) {
      users.push({
        username: `rentme${parseInt((index + 1) /4 )}`,
        password: await argon2.hash(`Str0ng!Passw0rd`),
        email: `rentme${parseInt((index + 1) /4 )}@rentme.games`,
        fullName: `${girlName[ Math.floor(Math.random() * lengthName) ]}`,
        birthDate: randomDate(new Date(1992, 0, 1), new Date(2002, 0, 1)),
        gender: 'female',
        avatar: avatarResult.resources[index / 4].secure_url
      })
    }

    users = await User.insertMany(users)

    console.log('here');
    const imgResult = await cloudinary.search
      .expression(
        'rentme-sample-data/*', // add your folder
      )
      .sort_by('public_id', 'desc')
      .max_results(max_results)
      .execute();

    const { resources } = imgResult;
    // const player_profiles
    
    let player_profiles = []
    for (let index = 0; index < resources.length; index += 4) {
      
       player_profiles.push({
        nickname: users[ parseInt((index + 1) /4 )].fullName,
        coverBackground: resources[index].secure_url,
       albums: [
        resources[index + 1].secure_url,
        resources[index + 2].secure_url,
        resources[index + 3].secure_url,
      ],
       shortDesc: 'Người Chơi Hệ Đáng Yêu',
       pricePerHour: Math.floor(Math.random() * 100 + 2),
       timeCanReceive: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
       status: "Accepted",
       userId: users[parseInt((index + 1) /4 )]._id
       })
    }
    player_profiles = await PlayerProfiles.insertMany(player_profiles)
    res.send({
      msg: `created ${max_results}`,
      player_profiles
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
