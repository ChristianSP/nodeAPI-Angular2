
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var friendSchema = require('./friendSchema');

module.exports = new Schema({
    name: { type:String,unique:true,required: true},
    email: { type:String,unique:true,required: true}, 
    password: String, 
    role: {type:String, default: "USER",required: true},
    verificationToken: String,
    isVerified: {type:Boolean, default: false,required: true},
    resetPasswordToken: String,
    resetPasswordExpiration: String,
    friends: [friendSchema],
    status: { type: String}
});