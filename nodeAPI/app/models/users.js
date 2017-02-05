// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: { type:String,unique:true,required: true},
    email: { type:String,unique:true,required: true}, 
    password: String, 
    role: {type:String, default: "USER",required: true},
    verificationToken: String,
    isVerified: {type:Boolean, default: false,required: true},
    resetPasswordToken: String,
    resetPasswordExpiration: String,
}));
