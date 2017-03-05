
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    liga: { type:String,required: true },
    inicio: { type:String,required: true },
    fin: { type:String,required: true },
    matchday: { type:String,required: true }
});