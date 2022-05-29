// drone schema
const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    id:  { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    last_location: { type: [Number] },
    logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }]
});