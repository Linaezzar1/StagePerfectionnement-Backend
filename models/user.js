const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name : {
            type : String,
        },
        lastname : {
            type : String,
        },
        email : {
            type: String,
            required: true,
            unique: true
        },
        password : {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'user', 
            required: true
        },
        ActiveStatus: {
            type: String 
          }
    },
    {timestamps: true}
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
