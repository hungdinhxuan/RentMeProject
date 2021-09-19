const User = require('../models/users');

class UsersController {
  async getOne(req, res) {
    const id = req.params.id;
    if (req.user._id == id) {
      return res.json({ success: true, message: 'User found', user: req.user });
    }
    try {
      const user = await User.findById({ _id: id });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, message: 'User found', user });
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
    let users;
    if (page) {
      let skip = (page - 1) * PAGE_SIZE;
      try {
        users = await User.find().skip(skip).limit(limit);
        return res.json({ success: true, users });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Internal Server Error' });
      }
    }
    try {
      users = await User.find();
      return res.json({ success: true, users });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }
}

module.exports = new UsersController();
