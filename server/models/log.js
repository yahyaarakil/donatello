// log model
const mongoose = require('mongoose');
const logSchema = require('../schemas/log');

module.exports = new mongoose.model('Log', logSchema);