const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// require("dotenv").config();

const bucket_name = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  region,
});

const uploadAudiosS3 = multer({
  storage: multerS3({
    s3,
    bucket: bucket_name,
    // acl: "private",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'audio/mpeg' ||
      file.mimetype == 'audio/mp3' ||
      file.mimetype == 'audio/midi' ||
      file.mimetype == 'audio/x-midi' ||
      file.mimetype == 'audio/ogg' ||
      file.mimetype == 'audio/opus' ||
      file.mimetype == 'audio/wav' ||
      file.mimetype == 'audio/webm'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error(
          'Audio must be .mpeg, .mp3, .mpeg3, .mid .midi, .oga, .opus, .wav, .weba  format!',
        ),
      );
    }
  },
  /// limit 10MB to upload
  limits: { fileSize: 1024 * 1024 * 10 },
});

const uploadImagesCloudinary = multer({
  storage: multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/gif' ||
      file.mimetype == 'image/svg+xml'
    ) {
      cb(null, true);
    } else {
      //  console.log("else");
      cb(null, false);
      return cb(
        new Error('Only .png, .jpg, .gif, .svg and .jpeg format allowed!'),
      );
    }
  },
  /// limit 10MB to upload
  limits: { fileSize: 1024 * 1024 * 10 },
});

const uploadVideosCloudinary = multer({
  storage: multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'video/x-msvideo' ||
      file.mimetype == 'video/mp4' ||
      file.mimetype == 'video/mpeg' ||
      file.mimetype == 'video/ogg' ||
      file.mimetype == 'video/webm' ||
      file.mimetype == 'video/3gpp'
    ) {
      cb(null, true);
    } else {
      //  console.log("else");
      cb(null, false);
      return cb(
        new Error(
          'Only .avi, .mp4, .mpeg, .ogv, .webm and .3gp format allowed!',
        ),
      );
    }
  },
  // Uplaod 50MB video
  limits: { fileSize: 1024 * 1024 * 50 },
});

/// mimetypes is array, error_msg is error, fileSize is size of a file
const upload = (mimetypes, error_msg, fileSize) => {
  return {
    s3: () =>
      multer({
        storage: multerS3({
          s3,
          bucket: bucket_name,
          // acl: "private",
          metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
          },
          key: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (
            // file.mimetype == 'audio/mpeg' ||
            // file.mimetype == 'audio/mp3' ||
            // file.mimetype == 'audio/midi' ||
            // file.mimetype == 'audio/x-midi' ||
            // file.mimetype == 'audio/ogg' ||
            // file.mimetype == 'audio/opus' ||
            // file.mimetype == 'audio/wav' ||
            // file.mimetype == 'audio/webm'
            mimetypes.indexOf(file.mimetype) !== -1
          ) {
            cb(null, true);
          } else {
            cb(null, false);
            return cb(
              new Error(
                error_msg,
              ),
            );
          }
        },
        
        limits: { fileSize },
      }),
    cloudinary: () =>
      multer({
        storage: multer.diskStorage({
          filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now());
          },
        }),
        fileFilter: (req, file, cb) => {
          if (mimetypes.indexOf(file.mimetype) !== -1) {
            cb(null, true);
          } else {
            //  console.log("else");
            cb(null, false);
            return cb(new Error(error_msg));
          }
        },
        
        limits: { fileSize },
      }),
  };
};

module.exports = {
  uploadAudiosS3,
  uploadImagesCloudinary,
  s3,
  bucket_name,
  uploadVideosCloudinary,
  cloudinary,
  upload
};
