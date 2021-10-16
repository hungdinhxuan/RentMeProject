const User = require('../models/users.models');
const Transaction = require('../models/transactions.models');
const argon2 = require('argon2');
const { multer } = require('../utils/config');
const multerLib = require('multer');
const streamifier = require('streamifier');
const { cloudinary, upload } = require('../services/multer');

class UsersController {
  async getOne(req, res) {
    const id = req.params.id;
    if (req.user._id == id) {
      return res.send(req.user);
    }
    try {
      const user = await User.findById({ _id: id });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'User not found' });
      }
      return res.send(user);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }
  async getAll(req, res) {
    const { page, limit } = req.query;
    let { deleted } = req.body;
    deleted = deleted === 'true';
    let users;
    if (page) {
      /// Find all users including deleted

      let skip = (page - 1) * limit;

      try {
        users = deleted
          ? await User.findWithDeleted().skip(skip).limit(limit)
          : await User.find().skip(skip).limit(limit);
        return res.json(users);
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Internal Server Error' });
      }
    }
    try {
      users = deleted ? await User.findWithDeleted() : await User.find();
      return res.send(users);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Some error occurred while retrieving data',
        error,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { password, newPassword } = req.body;

      const { _id } = req.user;
      const user = await User.findOne({ _id });
      const status = await argon2.verify(user.password, password);
      if (status) {
        if (password === newPassword) {
          return res.status(400).json({
            success: false,
            message: 'New Password must be different with old password',
          });
        }
        const hashPassword = await argon2.hash(newPassword);
        await User.findByIdAndUpdate(_id, { password: hashPassword });
        return res.json({
          success: true,
          message: 'Password updated successfully',
        });
      }
      return res.json({
        success: false,
        message: 'Password you typed is incorrect',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }

  async changeAvatar(req, res) {
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

      const { id } = req.params;

      function cloudinaryDone(error, result) {
        if (error) {
          console.log('Error in cloudinary.uploader.upload_stream\n', error);
          return res.status(500).json({
            success: false,
            message: 'Error in cloudinary.uploader.upload_stream',
          });
        }
        User.findByIdAndUpdate(
          req.user._id,
          { avatar: result.secure_url },
          (err, data) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message || 'Internal Server Error',
              });
            }
            return res.json({ success: true, newAvatar: data.avatar });
          },
        );
        console.log(result);
      }
      // console.log(req.file);
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: 'rentme',
            filename_override: `${req.user._id}_avatar`,
            unique_filename: false,
          },
          cloudinaryDone,
        )
        .end(req.file.buffer);
    });
  }

  async changeUserInfo(req, res) {
    const { fullName, nickname, birthDate, gender, province } = req.body;

    console.log(req.body);
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          fullName,
          nickname,
          birthDate: new Date(birthDate),
          gender,
          province,
        },
        { new: true },
      );
      console.log(user);
      return res.json({ success: true, message: 'Update successful', user });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }

  async createUser(req, res) {
    const { username, password, email, fullName, role } = req.body;
    try {
      const hashPassword = await argon2.hash(password);
      const user = await User.create({
        username,
        password: hashPassword,
        email,
        fullName,
        role,
      });
      return res
        .status(201)
        .json({ success: true, message: 'Created user', user });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }

  async softDelete(req, res) {
    const { id } = req.params;
    try {
      if (id == req.user._id) {
        return res
          .status(400)
          .json({ success: false, message: 'You cannot delete yourself !!!' });
      }
      await User.delete({ _id: id });
      return res
        .status(200)
        .json({ success: true, message: `User ${id} is moved to bin !!` });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }

  async createPlayer(req, res) {
    try {
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  async transact(req, res) {
    const { money, type, paymentMethod } = req.body;
    new Transaction({
      userId: req.user._id,
      money,
      type,
      paymentMethod,
    }).save((err, transaction) => {
      if (err) {
        if(err.message){ // error because new Error()
          return res.status(500).json({success: false, message: err.message});
        }
        return res.status(500).json(err);
      } else {
        return res.status(201).json({
          success: true,
          transaction,
          message: `${type} successfully !!`,
        });
      }
    });
  }
}

module.exports = new UsersController();
