// Initial refactoring content:
module.exports = {
    database: 'mongodb://localhost:27017/nodekb',
    secret: 'yoursecret'
  }
  
/* const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;  */