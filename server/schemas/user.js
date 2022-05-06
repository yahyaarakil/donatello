// user schema
const mongoose = require('mongoose')

const DEFAULT_PROFILE_PICTURE_PATH = '/default.png';

module.exports = new mongoose.Schema({
    email:  { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    profilePicture: { type: String, get: v => v ? v : DEFAULT_PROFILE_PICTURE_PATH },
    role: { type: Number, required: true, default: 1 },
    drones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drone' }]
});