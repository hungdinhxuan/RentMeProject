const User = require('../models/users.model');
const Player_Profile = require('../models/player_profiles.model')
const argon2 = require('argon2');

class UsersManagement {
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
  async createUser(req, res) {
    const { fullName, username, email, password, role } =
      req.body;
    try {
      const user = await User.create({
        fullName,
        username,
        email,
        password: await argon2.hash(password),
        role,
      });
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Some error occurred while creating the User',
        error: error,
      });
    }
  }

  async softDeleteUsers(req, res) {
    if (Object.prototype.toString.call(req.body.ids) === '[object Array]') {
      try {
        let ids = req.body.ids
        if(ids.indexOf(req.user._id.toString()) > -1){ // if user try to delete himself
          ids.splice(ids.indexOf(req.user._id), 1)
          if(ids.length === 0){
            return res.status(400).json({
              success: false,
              message: 'You can not delete yourself !!',
            });
          }
        }
        await Player_Profile.delete({userId: {$in: ids}})
        await User.delete({ _id: { $in: ids }, role: { $gte: 1 } })
        return res.status(200).json({
          success: true,
          message: 'deleted successfully !!',
          userIds: ids,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'ids must be an array !!',
      });
    }
  }

  async restoreUsers(req, res) {
    if (Object.prototype.toString.call(req.body.ids) === '[object Array]') {
      try {
        await Player_Profile.restore({userId: {$in: req.body.ids}})
        await User.restore({ _id: { $in: req.body.ids } })
        return res.status(200).json({
          success: true,
          message: 'restored successfully !!',
          userIds: req.body.ids,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'ids must be an array !!',
      });
    }
  }

  async forceDeleteUsers(req, res) {
    if (Object.prototype.toString.call(req.body.ids) === '[object Array]') {
      if (req.body.ids.indexOf(req.user._id.toString()) > -1) {
        return res.status(400).json({
          success: false,
          message: 'You can not delete yourself !!',
        });
      }
      try {
        
        await Player_Profile.deleteMany({userId: {$in: req.body.ids}})
        await User.deleteMany({ _id: { $in: req.body.ids }, role: { $gte: 1 }});
        return res.status(200).json({
          success: true,
          message: 'deleted successfully !!',
          userIds: req.body.ids,
        });
      } catch (error) { 
        return res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
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
    
    try {
      let user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      if(user.password !== password){ // if changed password
        
        user = await User.findOneAndUpdate(
          { _id },
          {
            fullName,
            username,
            email,
            password: await argon2.hash(password),
            province,
            role,
          },
          { new: true },
        );
      }else{
        console.log('password is not changed');
        user = await User.findOneAndUpdate(
          { _id },
          {
            fullName,
            username,
            email,
            province,
            role,
          },
          { new: true },
        );
      }
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
  async getDeletedUsers(req, res){
    try {
      const deletedUsers = await User.findDeleted();
      return res.status(200).json({
        success: true,
        users: deletedUsers,
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

module.exports = new UsersManagement();
