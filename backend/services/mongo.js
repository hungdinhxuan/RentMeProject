const mongoose = require('mongoose');

module.exports = async () => {
  if (process.env.NODE_ENV === 'production') {
    MONGO_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.rrcyu.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`;
  }else{
    MONGO_URL = `mongodb://test:test@localhost:27017/${process.env.MONGODB_DATABASE_NAME}`
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connect to database successfully');
  } catch (error) {
    console.log(error);
    console.log('Cannot connect to database');
  }
};
