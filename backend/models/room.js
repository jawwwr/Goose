const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    room_name: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Room', roomSchema);