var env = process.env.NODE_ENV || 'production',
	config = require('./config')[env];


var express = require('express');
	http = require('http');

var OAuth = require('oauth'),
            passport = require('passport'),
            FitBitStrategy = require('passport-fitbit').Strategy;

passport.serializeUser(function(user, done) {
	// console.log("serialize user", user);
	done(null, user);
});



passport.deserializeUser(function(obj, done) {
	// console.log("deserialize obj", obj);
	done(null, obj);
});

//Tell Passport to use Fitbit Strategy

console.log("http://" + config.host + "/auth/fitbit/callback");

passport.use(new FitBitStrategy({
                consumerKey: config.fitbitClientKey,
		consumerSecret: config.fitbitClientSecret
	},
	function(token, tokenSecret, profile, done) {
    profile['token_info'] = [token, tokenSecret];
	  return done(null, profile);

		/*oauth.get(
			'http://api.fitbit.com/1/user/-/activities/calories/date/today/7d.json',
			token,
			tokenSecret,
			function(err, data, res) {
				if (err) console.error(err);
				console.log("update" + data);
			}
		);*/
	}
));
	

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('TODO Random String: Fitbit is awesome!'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

var IndexController = require('./controllers/index'),
	FitbitAuthController = require('./controllers/fitbit-auth'),
	FitbitApiController = require('./controllers/fitbit-api');

app.get('/', IndexController.index);
app.get('/auth/fitbit/?', passport.authenticate('fitbit'));
app.get('/auth/fitbit/callback', 
  passport.authenticate('fitbit'),
  function(req, res) {
    console.log(req.user);
    res.redirect('/');
  });


http.createServer(app).listen(app.get('port'), function() {
	console.log('express server listening on port ' + app.get('port'));
});
