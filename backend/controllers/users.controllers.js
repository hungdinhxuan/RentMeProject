const User = require('../models/users');
const argon2 = require('argon2');
const DetailUser = require('../models/detail_users');

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
    deleted = (deleted === 'true');
    let users;
    if (page) {
      /// Find all users including deleted

      let skip = (page - 1) * PAGE_SIZE;

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

  async uploadAvatar(req, res) {}

  async createDetailUser(req, res) {
    try {
      let { nickname, birthDate, province, desc } = req.body;
      desc = desc || '';
      await DetailUser.create({ nickname, birthDate, province, desc });
      return res.status(200).json({ success: true, message: 'Created' });
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
}

module.exports = new UsersController();
