const PlayerProfiles = require('../models/player_profiles.model');
const Reviews = require('../models/reviews.model');
const Trading = require('../models/tradings.model');
const Transfer = require('../models/transfers.model');
const User = require('../models/users.model');
const { multer } = require('../utils/config');
const { cloudinary, upload } = require('../services/multer');
const multerLib = require('multer');
const streamifier = require('streamifier');

const mongoose = require('mongoose');
class PlayersControllers {
  
  async getOnePlayer(req, res) {
    let { id } = req.params;
    try {
      const player_profiles = await PlayerProfiles.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $match: {
            _id: mongoose.Types.ObjectId(id),
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            'user.password': 0,
            'user.username': 0,
            'user.email': 0,
            'user.role': 0,
          },
        },
      ]);
      return res.send(player_profiles[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Some error occurred while retrieving data',
        error,
      });
    }
  }

  async filterPlayers(req, res) {
    let { page, limit, status, gender, price, age } = req.query;
    let player_profiles;

    try {
      if (page) {
        page = parseInt(page);
        limit = parseInt(limit);
        let skip = (page - 1) * limit;

        if (status == 'true') {
          // console.log('get online players');
          player_profiles = await PlayerProfiles.aggregate([
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $lookup: {
                from: 'services',
                localField: 'services',
                foreignField: '_id',
                as: 'services',
              },
            },
            // { $unwind: '$user' },
            {
              $project: {
                'user.password': 0,
                'user.username': 0,
                'user.email': 0,
                'user.role': 0,
                'services.desc': 0,
                'services.deleted': 0,
                'services.createdAt': 0,
                'services.updatedAt': 0,
              },
            },
            { $sort: { 'user.isOnline': -1 } },
            { $skip: skip },
            { $limit: limit },
          ]);
        } else {
          // console.log('get offline players');
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
                'services.desc': 0,
                'services.deleted': 0,
                'services.createdAt': 0,
                'services.updatedAt': 0,
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
              'services.desc': 0,
              'services.deleted': 0,
              'services.createdAt': 0,
              'services.updatedAt': 0,
            },
          },
          { $sort: { 'user.isOnline': -1 } },
          { $limit: limit },
        ]);

        return res.send(player_profiles);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  async filterPlayerProfiles(req, res) {
    let { page, limit, status, gender, minPrice, maxPrice, minAge, maxAge } =
      req.query;

    // gender = gender || 'female';
    minPrice = Number(minPrice) || 1;
    maxPrice = Number(maxPrice) || 1000;
    minAge = parseInt(minAge) || 16;
    maxAge = parseInt(maxAge) || 70;
    

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 50;
    let skip = (page - 1) * limit;

    function calculateBirthDateFromAge(age) {
      let today = new Date();
      let birthDate = new Date();
      birthDate.setFullYear(today.getFullYear() - age);
      return birthDate;
    }
    

    try {
      let player_profiles = await PlayerProfiles.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'services',
            localField: 'services',
            foreignField: '_id',
            as: 'services',
          },
        },
        // { $unwind: '$user' },
        {
          $project: {
            'user.password': 0,
            'user.username': 0,
            'user.email': 0,
            'user.role': 0,
            'user.balance': 0,
            'user.following': 0,
            'user.follower': 0,
            'user.blockList': 0,
            'user.typeAccount': 0,
            'user.deleted': 0,
            'user.createdAt': 0,
            'user.updatedAt': 0,
            'services.desc': 0,
            'services.deleted': 0,
            'services.createdAt': 0,
            'services.updatedAt': 0,
          },
        },
        { $sort: { 'user.isOnline': -1 } },
        {
          $match: {
            
            $and: [
              {
                $or: [
                  {'user.isOnline': status ? status === 'true' : true},
                  {'user.isOnline': status ? status === 'true' : false},
                ],
              },
              {
                $or: [
                  {
                    'user.gender': gender ? gender : 'female'
                  },
                  {
                    'user.gender': gender ? gender : 'male'
                  }
                ],
              },
            ],


            'user.birthDate': {
              $lte: calculateBirthDateFromAge(minAge), /// ngay sinh nho hon thi nhieu tuoi hon
              $gte: calculateBirthDateFromAge(maxAge),
            },
            pricePerHour: {
              $gte: minPrice,
              $lte: maxPrice,
            },
            status: 'Accepted'
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      return res.status(200).send(player_profiles);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
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
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    });
  }

  async registerPlayer(req, res) {
    upload(
      multer.mimeTypes.image,
      multer.multerError.image,
      multer.multerFileSizeLimit,
    )
      .cloudinary()
      .array('albums', multer.maxCount.images)(req, res, async (err) => {
      const { nickname, shortDesc, longDesc, userId, pricePerHour, services } =
        req.body;
      console.log(req.body);
      if (
        !nickname ||
        !shortDesc ||
        !longDesc ||
        !userId ||
        !pricePerHour ||
        !services
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input',
        });
      }
      if (!req.user._id.equals(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user',
        });
      }
      try {
        const player_profile = await PlayerProfiles.findOne({ userId: userId });
        if (player_profile) {
          if (player_profile.status === 'Under Review') {
            return res.status(400).json({
              success: false,
              message: 'Your request is processing ! Please wait until admin accept',
            });
          } else if (player_profile.status === 'Accepted') {
            return res.status(400).json({
              success: false,
              message: 'You have already been player!',
            });
          } else if (player_profile.status === 'Banned') {
            return res.status(400).json({
              success: false,
              message: 'This player is banned!',
            });
          }
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }

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
      if (!req.files || req.files.length === 0)
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
      function isArray(obj) {
        return obj.constructor.toString().indexOf('Array') != -1;
      }
      try {
        let multiplePicturePromise = req.files.map((file) =>
          uploadFromBuffer(file, req.body.id),
        );
        let imageResponses = await Promise.all(multiplePicturePromise);
        let coverBackgroundImage = imageResponses.shift();
        
        let player = await PlayerProfiles.create({
          nickname,
          shortDesc,
          longDesc,
          userId,
          pricePerHour,
          services: isArray(services) ? services : JSON.parse(services),
          albums: imageResponses.map((image) => image.secure_url),
          coverBackground: coverBackgroundImage.secure_url,
          status: 'Under Review',
          timeCanReceive: [
            8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
          ],
        });
        return res.json({
          success: true,
          message:
            'Player created successfully ! Please wait until admin consider your profile',
          player,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    });
  }

  async getReviews(req, res) {
    try {
      const { id } = req.params; //profile id
      const reviews = await Reviews.find({ playerProfileId: id }).populate({
        path: 'userId',
        select: 'avatar _id fullName',
      });
      return res.status(200).send(reviews);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
  async createReview(req, res) {
    try {
      const { tradingId, content, rating } = req.body;
      const trading = await Trading.findById(tradingId);
      if (
        trading.status === 'pending' ||
        trading.status === 'performing' ||
        trading.status === 'aborted'
      ) {
        return res
          .status(400)
          .json({ success: false, messsage: 'Trading is not valid' });
      }
      if (!trading.renterId.equals(req.user._id)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot review because user is not valid',
        });
      }
      const player_profile = await PlayerProfiles.findOne({
        userId: trading.playerId,
      });
      const review = await Reviews.create({
        userId: trading.renterId,
        playerProfileId: player_profile._id,
        content,
        rating,
        tradingId,
      });
      return res
        .status(201)
        .json({ success: true, message: 'Review Success!', review });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
  async donate(req, res) {
    const { money } = req.body;
    const playerProfileId = req.params.id;
    try {
      const playerProfile = await PlayerProfiles.findById(
        playerProfileId,
      ).populate('userId', 'username fullName');
      await new Transfer({
        sender: req.user._id,
        receiver: playerProfile.userId,
        money,
        type: 'donate',
      }).save((err, transfer) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message || 'Internal Server Error',
            error: err,
          });
        }
        return res.status(200).json({
          success: true,
          message: `Donate to ${playerProfile.userId.fullName} successful!`,
          playerName: playerProfile.userId.username,
          money: transfer.money,
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }
  async follow(req, res) {
    const playerProfileId = req.params.id;
    try {
      const playerProfile = await PlayerProfiles.findById(playerProfileId);
      User.findById(playerProfile.userId, async (err, player) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message || 'Internal Server Error',
          });
        }
        let index = player.follower.indexOf(req.user._id);
        if (index === -1) {
          /// chua follow
          player.follower.push(req.user._id);
          await player.save();
          User.findById(req.user._id, async (err2, renter) => {
            if (err2) {
              return res.status(500).json({
                success: false,
                message: err2.message || 'Internal Server Error',
              });
            }
            renter.following.push(player._id);
            await renter.save();

            return res
              .status(200)
              .json({ success: true, message: 'following success', player });
          });
        } else {
          player.follower.splice(index, 1);
          await player.save();
          User.findById(req.user._id, async (err2, renter) => {
            if (err2) {
              return res.status(500).json({
                success: false,
                message: err2.message || 'Internal Server Error',
              });
            }
            let index2 = renter.following.indexOf(player._id);
            renter.following.splice(index2, 1);
            await renter.save();
            console.log(player);
            return res
              .status(200)
              .json({ success: true, message: 'unfollowing success', player });
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }
}

module.exports = new PlayersControllers();
