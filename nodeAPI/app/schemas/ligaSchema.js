
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    name: { type:String,unique:true,required: true },
    idApi: { type:String,unique:true,required: true }
});