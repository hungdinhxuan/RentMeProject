const { uploadS3, bucket_name, s3, upload } = require('../services/s3');
const multer = require('multer');
const S3_URL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/`;

class S3 {
  listAllObjects(req, res) {
    const bucketParams = {
      Bucket: bucket_name,
    };
    console.log(S3_URL);
    s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        return res.json({ message: err.message });
      } else {
        console.log(data);

        return res.json({
          success: true,
          message: 'ok',
          data: data.Contents.map((item) => `${S3_URL}item.Key`),
        });
      }
    });
  }
  uploadOneImage(req, res, next) {
    const singleUpload = uploadS3.single('image');
    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);

        return res.status(400).json({
          success: false,
          err,
          message: 'Kích thước file tối đa là 10MB ',
          
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
        return res.status(400).json({
          success: false,
          err,
          message: 'Định dạng file không hợp lệ, Chỉ .png, .jpg và .jpeg được cho phép',

        });
      }
      console.log(req.file);
      
      return res.json({
        success: true,
        message: 'uploaded',
        url: req.file.location,
      });
    });
  }
  uploadMultiImages(req, res, next) {
    const multiUpload = upload.array('images', 10);
    multiUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);

        return res.status(400).json({
          success: false,
          err,
          message: 'Tổng dung lượng file upload phải nhỏ hơn 10 MB',
          
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
        return res.status(400).json({
          success: false,
          err,
          message: 'Định dạng file không hợp lệ, Chỉ .png, .jpg và .jpeg được cho phép',
          
        });
      }
      return res.json({
        success: true,
        message: 'uploaded',
      });
    });
  }
  async deleteOneObject(req, res, next) {
    const pathName = req.body.file_name;
    const bucketParams = {
      Bucket: bucket_name,
      Key: pathName,
    };
    try {
      await s3.deleteObject(bucketParams).promise();
      return res.json({ success: true, message: 'Removed' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  }
}

module.exports = new S3();
