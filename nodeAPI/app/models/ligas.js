// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ligaSchema = require('../schemas/ligaSchema')
// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Liga',ligaSchema);
