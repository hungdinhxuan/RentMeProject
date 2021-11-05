const Player_Profile = require('../models/player_profiles.model');
const User = require('../models/users.model');

class PlayerManagement {
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
