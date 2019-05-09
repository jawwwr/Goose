const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_name: {type: String, required: true},
    rooms: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Room'}
    ]
},
{ 
    timestamps: { 
        createdAt: 'created_at' 
    }
});

module.exports = mongoose.model('User', userSchema);