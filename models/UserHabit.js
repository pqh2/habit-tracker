 // grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')
// User schema
var UserHabitSchema = new Schema({
	userid: {type: String, require: true},
	category: {type: String, require: true},
    name: { type: String, required: true }
});
module.exports = mongoose.model('UserHabit', UserHabitSchema);
