const User = require('../models/users.model');

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
}

module.exports = new ManagementController();
