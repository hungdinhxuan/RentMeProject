const User = require('../models/users.model');
const argon2 = require('argon2');

class ManagementController {
  async getUsers(req, res) {
    let { page, limit } = req.query;
    limit = limit || 50;
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
  createUser(req, res) {
    const { fullName, username, email, password, gender, province, role } =
      req.body;
    const user = new User({
      fullName,
      username,
      email,
      password,
      gender,
      province,
      role,
    });
    user.save((err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message || 'Some error occurred while creating the User',
          error: err,
        });
      }
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user,
      });
    });
  }

  softDeleteUsers(req, res) {
    if (Object.prototype.toString.call(req.body.ids) === '[object Array]') {
      User.delete({ _id: { $in: req.body.ids } }, (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            err,
          });
        }
        return res.status(200).json({
          success: true,
          message: 'deleted successfully !!',
          userIds: req.body.ids,
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'ids must be an array !!',
      });
    }
  }

  restoreUsers(req, res) {
    if (Object.prototype.toString.call(req.body.ids) === '[object Array]') {
      User.restore({ _id: { $in: req.body.ids } }, (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            err,
          });
        }
        return res.status(200).json({
          success: true,
          message: 'restored successfully !!',
          userIds: req.body.ids,
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'ids must be an array !!',
      });
    }
  }

  forceDeleteUsers(req, res) {
    if (Object.prototype.toString.call(req.body.ids) === '[object Array]') {
      if (req.body.ids.indexOf(req.user._id) > -1) {
        return res.status(400).json({
          success: false,
          message: 'You can not delete yourself !!',
        });
      }
      User.deleteMany({ _id: { $in: req.body.ids } }, (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            err,
          });
        }
        return res.status(200).json({
          success: true,
          message: 'deleted successfully !!',
          userIds: req.body.ids,
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'ids must be an array !!',
      });
    }
  }

  async updateUser(req, res) {
    const { _id, fullName, username, email, password, province, role } =
      req.body;
    const roles = {
      admin: 0,
      streamer: 1,
      player: 2,
      user: 3,
    };
    try {
      const user = await User.findOneAndUpdate(
        { _id },
        {
          fullName,
          username,
          email,
          password: await argon2.hash(password),
          province,
          role: roles[role],
        },
        { new: true },
      );
      return res.status(200).json({
        success: true,
        message: 'updated successfully !!',
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Some error occurred while retrieving data',
        error,
      });
    }
  }
}

module.exports = new ManagementController();
