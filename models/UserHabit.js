 // grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')
// User schema
var UserHabitSchema = new Schema({
	userid: {type: String, require: true},
	category: {type: String, require: true},
    name: { type: String, required: true },
	streakLength: { type: Number, default: 0 },
	lastUpdate: {type: Date},
	timeZone: {type: Number},
	weekPattern: {type: String, default: "1111111"}
});
module.exports = mongoose.model('UserHabit', UserHabitSchema);
