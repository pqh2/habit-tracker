module.exports = function(app) {
	var mongoose       = require('mongoose');
	var bodyParser     = require('body-parser');
	var methodOverride = require('method-override');
	var bcrypt = require('bcrypt')
	var fs = require('fs');
	var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens	



	// models
	var User = mongoose.model('User')
	var UserHabit = mongoose.model('UserHabit')

	function getUTC(date)
	{
		var now_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		return now_utc;
	}

	app.post('/api/increaseHabitStreak', function(req, res) {
	  console.log("increasing streak");
	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];
	  console.log(token);
	  // decode token
	  if (token) {
	    // verifies secret and checks exp
	    jwt.verify(token, 'ilovemyscotch', function(err, decoded) { 
			var habitid = req.body.habitid || '';
			UserHabit.findOne({ _id: habitid }, function (err, userhabit){
				console.log("Updating streak");
				userhabit.streakLength++;
				userhabit.lastUpdate = getUTC(new Date());
				userhabit.markModified('lastUpdate');
				userhabit.save(function() {
					res.status(200).send({ 
						success: true, 
						message: 'Success.' 
					});
					}
				);
			});
		});	
	
		}
	});

	app.post('/api/createhabit', function(req, res) {
	
	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];
	  console.log(token);
	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, 'ilovemyscotch', function(err, decoded) { 
			var userid = req.body.userid || '';
			var category = req.body.category || '';
			var name = req.body.name || '';
			var weekpattern = req.body.weekpattern || '';
			var newHabit = new UserHabit();
			newHabit.userid = userid;
			newHabit.category = category;
			newHabit.name = name;
			newHabit.weekPattern = weekpattern;
			console.log(newHabit);
			newHabit.save(function () {
				res.status(200).send({ 
						success: true, 
						message: 'Success.' 
					});
			});
		});	
	
	  }
	});

	app.post('/api/userhabits', function(req, res) {
	
	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];
	  console.log("Token:");
	  console.log(token);
	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, 'ilovemyscotch', function(err, decoded) { 
			var userid = req.body.userid || '';
			console.log("User id: ");
			console.log(userid);
			UserHabit.find({userid: userid}, function(err, data) {
				var userid = req.body.token || req.query.token || req.headers['x-access-token'];
				if (err) {
					 return res.status(401).send({ 
						success: false, 
						message: 'Error retrieving user habits.' 
					});
				}
			
				res.send(data);
			});
		});	
	
		}
	});

	app.post('/api/testtoken', function(req, res) {
		// check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, 'ilovemyscotch', function(err, decoded) {      
	      if (err) {
		return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
		// if everything is good, save to request for use in other routes
		return res.status(200).send({ 
				success: true, 
				message: 'Success' 
			});
	      }
	    });

	  } else {

	    // if there is no token
	    // return an error
	    return res.status(403).send({ 
		success: false, 
		message: 'No token provided.' 
	    });
	    
	  }
	});   

	app.post('/api/login', function(req, res) {
	    var username = req.body.username || '';
	    var password = req.body.password || '';
	 
	    if (username == '' || password == '') {
		return res.send(401);
	    }
	 
	    User.findOne({username: username}, function (err, user) {
		if (err) {
		    console.log(err);
		    return res.send(401);
		}
			if (user != null)
			{
				user.comparePassword(password, function(isMatch) {
					if (!isMatch) {
						console.log("Attempt failed to login with " + user.username);
						return res.send(401);
					}
		 
					var token = jwt.sign(user, 'ilovemyscotch', { expiresInMinutes: 60 });
		 
					return res.json({token:token, userid: user._id});
				});
			} else {
				console.log("No user found");
			}
	    });
	});   

	app.post('/api/signup', function(req, res) {
		var username = req.body.username || '';
	    var password = req.body.password || '';
	
	    if (username == '' || password == '') {
		return res.send(401);
	    }
	
		var SALT_WORK_FACTOR = 10;
		console.log("hashing");
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) {
		        return console.error(err);
		}

		bcrypt.hash(password, salt, function(err, hash) {
		        if(err) {
		                return console.error(err);
		        }

		      	var newUser = new User({username: username, password: hash});
					console.log(hash);
					newUser.save(function(err, newUser) {	
						if (err) {
							console.log(err);
							return res.send(401);
						}
					
						var token = jwt.sign(newUser, 'ilovemyscotch', { expiresInMinutes: 60 });
						return res.json({token:token});
					});

		});
		});

	});
	       

	// route to handle creating goes here (app.post)
	// route to handle delete goes here (app.delete)
	 app.get('/', function(req, res) {
	    console.log("New");
		res.sendfile('./public/views/index.html'); // load our public/index.html file
	});
}
