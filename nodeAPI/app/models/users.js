// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: { type:String,unique:true},
    email: { type:String,unique:true}, 
    password: String, 
    role: String,
    verificationToken: String,
    isVerified: {type:Boolean, default: false},
    resetPasswordToken: String
}));
