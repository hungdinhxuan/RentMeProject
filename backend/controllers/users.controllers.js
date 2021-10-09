const User = require('../models/users');
const argon2 = require('argon2');
const PlayerProfiles = require('../models/player_profiles');
const { multer } = require('../utils/config');
const multerLib = require('multer');
const streamifier = require('streamifier');
const {
  cloudinary,
  upload,
} = require('../services/multer');

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

      const {id} = req.params
      
       function cloudinaryDone(error, result) {
        if (error) {
          console.log('Error in cloudinary.uploader.upload_stream\n', error);
          return res.status(500).json({
            success: false,
            message: 'Error in cloudinary.uploader.upload_stream',
          });
        }
        User.findByIdAndUpdate(req.user._id, {avatar: result.secure_url}, (err, data) => {
          if(err){
            return res.status(500).json({
              success: false,
              message: err.message || 'Internal Server Error',
            });
          }
          return res.json({ success: true, newAvatar: data.avatar });
        })
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

  async getAllPlayers(req, res) {
    const { page, limit } = req.query;
    let { deleted } = req.body;
    deleted = deleted === 'true';
    let player_profiles;
    if (page) {
      /// Find all users including deleted

      let skip = (page - 1) * limit;

      try {
        player_profiles = deleted
          ? await PlayerProfiles.findWithDeleted()
              .skip(skip)
              .limit(limit)
              .populate('userId')
              .select('-password')
          : await PlayerProfiles.find()
              .skip(skip)
              .limit(limit)
              .populate('userId')
              .select('-password')
              .sort({ isOnline: 'asc' });
        return res.json(player_profiles);
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Internal Server Error' });
      }
    }
    try {
      users = deleted
        ? await User.findWithDeleted().limit(limit)
        : await User.find().limit(limit).sort({});
      return res.send(users);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Some error occurred while retrieving data',
        error,
      });
    }
  }

  async filterPlayers(req, res) {
    let { page, limit, status } = req.query;
    let player_profiles;

    page = parseInt(page);
    limit = parseInt(limit);
    try {
      if (page) {
        let skip = (page - 1) * limit;

        if (status == 'true') {
          console.log('get online players');
          player_profiles = await PlayerProfiles.aggregate([
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            // { $unwind: '$user' },
            {
              $project: {
                'user.password': 0,
                'user.username': 0,
                'user.email': 0,
                'user.role': 0,
              },
            },
            { $sort: { 'user.isOnline': -1 } },
            { $skip: skip },
            { $limit: limit },
          ]);
        } else {
          console.log('get offline players');
          player_profiles = await PlayerProfiles.aggregate([
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            // { $unwind: '$user' },
            {
              $project: {
                'user.password': 0,
                'user.username': 0,
                'user.email': 0,
                'user.role': 0,
              },
            },
            { $sort: { 'user.isOnline': 1 } },
            { $skip: skip },
            { $limit: limit },
          ]);
        }

        return res.send(player_profiles);
      } else {
        player_profiles = await PlayerProfiles.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          // { $unwind: '$user' },
          {
            $project: {
              'user.password': 0,
              'user.username': 0,
              'user.email': 0,
              'user.role': 0,
            },
          },
          { $sort: { 'user.isOnline': -1 } },
          { $limit: limit },
        ]);

        return res.send(player_profiles);
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }
  async createPlayer(req, res) {
    
    try {
      
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  async uploadAlbumsPlayer(req, res) {
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
              filename_override: `${req.user._id}_players_albums`,
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
  }
}

module.exports = new UsersController();
