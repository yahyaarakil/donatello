// drone schema
const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    id:  { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }]
});