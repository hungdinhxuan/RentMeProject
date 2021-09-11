const { upload, bucket_name, s3 } = require('../services/s3');
const singleUpload = upload.single('file');
const multiUpload = upload.array('files', 10);
const S3_URL = `https://${process.env.AWS_S3_BUCKET_NAME}.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/`;

class S3 {
  listAllObjects(req, res) {
    const bucketParams = {
      Bucket: bucket_name,
    };
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
  uploadOneObject(req, res, next) {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: 'File Upload Error',
            detail: err.message,
            error: err,
          },
        });
      }
      return res.json({
        success: true,
        message: 'uploaded',
      });
    });
  }
  uploadMultiObject(req, res, next) {
    multiUpload(req, res, (err) => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: 'File Upload Error',
            detail: err.message,
            error: err,
          },
        });
      }
      return res.json({
        success: true,
        message: 'uploaded',
      });
    });
  }
  deleteOneObject(req, res, next) {
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
