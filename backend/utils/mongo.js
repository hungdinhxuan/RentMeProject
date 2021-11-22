const mongoose = require('mongoose');
const User = require('../models/users.model');

const connectAndRetry = async () => {
  let MONGO_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.rrcyu.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(MONGO_URL);
    console.log(
      `Connect to database in ${process.env.NODE_ENV} environment successfully with ${process.env.MONGODB_USER}`,
    );
    // disconnect all users
    await User.updateMany({}, { isOnline: false, status: 'free' });
    console.log('All users disconnected');
  } catch (error) {
    console.log('Cannot connect to database - retrying in 5 sec ...');
    setTimeout(connectAndRetry, 5000);
  }
};

module.exports = connectAndRetry;
