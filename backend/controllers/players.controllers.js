const PlayerProfiles = require('../models/player_profiles.models');
const Reviews = require('../models/reviews.models');
const Trading = require('../models/tradings.models');

const mongoose = require('mongoose');
class PlayersControllers {
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
    let { page, limit, status } = req.query;
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
        return res
          .status(500)
          .json({
            success: false,
            message: error.message || 'Internal Server Error',
          });
      }
    });
  }
  async getReviews(req, res) {
    try {
      const { id } = req.params; //profile id
      const reviews = await Reviews.find({playerProfileId: id}).populate({path: 'userId', select: 'avatar _id fullName'})
      return res.status(200).send(reviews);
    } catch (error) {
      return res
        .status(500)
        .json({
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
        return res
          .status(400)
          .json({
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
        tradingId
      });
      return res
        .status(201)
        .json({ success: true, message: 'Review Success!', review });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
    }
  }
}

module.exports = new PlayersControllers();
