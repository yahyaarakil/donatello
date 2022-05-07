// log schema
const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    message: { type: String, required: true, immutable: true },
    drone: { type: mongoose.Schema.Types.ObjectId, ref: 'Drone' }
},
{
    timestamps: {
      createdAt: 'timestamp'
    }
});