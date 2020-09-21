const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    // file:{
    //     type: String
    // },
    date:{
        type: Date,
        default: Date.now
    }
});


module.exports = { 
    User: mongoose.model('User', UserSchema)
};