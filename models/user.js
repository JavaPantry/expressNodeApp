const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Use: const { User } = require('../models/user');
// const User = mongoose.model('User', UserSchema);
// module.exports.User = User;

// Use: const User = require('../models/user');
let User = module.exports = mongoose.model('User', UserSchema)