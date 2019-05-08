const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    room_name: {type: String, required: true},
    members: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    type: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},
{ 
    timestamps: { 
        createdAt: 'created_at' 
    }
});

module.exports = mongoose.model('Room', roomSchema);