 // grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')
// User schema
var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});
//Password verification
UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
			if(err) {
					return console.error(err);
			}

			cb(isMatch);
	});
}; 
 
module.exports = mongoose.model('User', UserSchema);
