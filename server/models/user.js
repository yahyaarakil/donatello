// user model
const mongoose = require('mongoose');
const userSchema = require('../schemas/user');

module.exports = new mongoose.model('User', userSchema);