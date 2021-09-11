const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.rrcyu.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`
    );
    console.log('Connect to database successfully');
  } catch (error) {
      console.log(error);
    console.log('Cannot connect to database');
  }
};
