// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = require('../schemas/userSchema')
// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User',userSchema);
