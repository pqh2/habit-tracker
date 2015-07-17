// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var bcrypt = require('bcrypt')
var fs = require('fs');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var routes = require('./routes/routes')

// configuration ===========================================
	
// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
 mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users


//load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});



// models
var User = mongoose.model('User')
var UserHabit = mongoose.model('UserHabit')


function getUTC(date)
{
	var now_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	return now_utc;
}

function isSameDateAs(dateOne, dateTwo) {
		  
  return (dateOne != undefined &&
	dateTwo != undefined &&
	dateOne.getFullYear() === dateTwo.getFullYear() &&
	dateOne.getMonth() === dateTwo.getMonth() &&
	dateOne.getDate() === dateTwo.getDate()
  );
}

function checkForBrokenStreaks() {
	UserHabit.find({}, function(err, userhabits) {
		userhabits.forEach(function(entry) {
			var habitDate = entry.lastUpdate;
			if (habitDate != undefined) {
				var now = getUTC(new Date());
				var nextDay = new Date(habitDate.getTime()  + 60 * 60 * 24 * 1000);				
		
				// loop that moves forward last updated date 
				// if habit was not required on given day as long as habitDate < now
				while(!isSameDateAs(now, habitDate)) {
					if (entry.weekPattern[nextDay.getDay()] == "0") {
						habitDate.setHours(habitDate.getHours() + 24);
						nextDay.setHours(nextDay.getHours() + 24);
						entry.lastUpdate = new Date(habitDate.valueOf());
					} else {
						break;
					}
				}			
		
				// if the habit was not updated today nor yesterday, this means
				// the user broke the streak - so we have to reset the streak to 0
				// and move the current date to yesterday (they might want to update today)
				if (!isSameDateAs(now, nextDay) && !isSameDateAs(now, habitDate)) {
					now.setHours(now.getHours() - 24);
					entry.lastUpdate  = new Date(now.valueOf());
					entry.streakLength = 0;
					console.log('Missed day on ' + entry.name);
				}			
		
				entry.markModified('lastUpdate');
				entry.save(function (err) {
				});
			}
		});
	});
}


// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 
routes(app);
					// expose app
setInterval(function() {
	console.log("Checking users habits");
	checkForBrokenStreaks();
}, 3600000);
