// drone model
const mongoose = require('mongoose');
const droneSchema = require('../schemas/drone');

module.exports = new mongoose.model('Drone', droneSchema);