const S3 = require("aws-sdk/clients/s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();

const bucket_name = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  region,
});

const upload = multer({
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
});



module.exports = { upload, s3, bucket_name};