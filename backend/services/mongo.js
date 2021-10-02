const mongoose = require('mongoose');

const connectAndRetry  = async () => {
  if (process.env.NODE_ENV === 'production') {
    MONGO_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.rrcyu.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`;
  }else{
    // MONGO_URL = `mongodb://admin:admin@localhost:27017`
    
    MONGO_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.rrcyu.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`;
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connect to database successfully');
  } catch (error) {
    // console.log(error);
    console.log('Cannot connect to database - retrying in 5 sec ...');
    setTimeout(connectAndRetry, 5000);
  }
};

module.exports = connectAndRetry;
