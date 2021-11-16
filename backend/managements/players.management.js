const Player_Profile = require('../models/player_profiles.model');
const User = require('../models/users.model');

class PlayerManagement {
  async getPlayers(req, res) {
    let {status, page, limit} = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 50;
    let skip = (page - 1) * limit;

    console.log(status);
    try {
      const player_profiles = await Player_Profile.aggregate([
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
            status
          },
        },
        {
          $project: {
            'user.password': 0,
            'user.email': 0,
            'user.role': 0,
          },
        },
        { $sort: { 'user.isOnline': -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
      return res.send(player_profiles);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
  async banPlayers(req, res) {
    try {
      const player_profiles = await Player_Profile.find({
        _id: { $in: req.body.ids },
      });
      const userIds = player_profiles.map((player) => player.userId);
      await Player_Profile.delete({ _id: { $in: req.body.ids } });
      await User.updateMany({ _id: { $in: userIds } }, { $set: { role: 3 } });
      return res.status(200).json({
        success: true,
        message: 'Players banned successfully',
        ids: req.body.ids,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server error',
      });
    }
  }
  async unlockPlayers(req, res) {
    try {
        const player_profiles = await Player_Profile.findOneWithDeleted({
          _id: { $in: req.body.ids },
        });
        const userIds = player_profiles.map((player) => player.userId);
        await Player_Profile.restore({ _id: { $in: req.body.ids } });
        await User.updateManyWithDeleted({ _id: { $in: userIds } }, { $set: { role: 2 } });
        return res.status(200).json({
          success: true,
          message: 'Unlock players successfully',
          ids: req.body.ids,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server error',
        });
      }
  }
  async getBannedPlayers(req, res) {
    try {
      const players = await Player_Profile.findDeleted({}).populate('services') ;
      return res.status(200).json({
        success: true,
        message: 'Banned players fetched successfully',
        players,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server error',
      });
    }
  }
}

module.exports = new PlayerManagement();
