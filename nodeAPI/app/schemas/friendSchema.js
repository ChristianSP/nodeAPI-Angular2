var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    user: { type: String, require: true},
    status: { type: String, require: true}
})