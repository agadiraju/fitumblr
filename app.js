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
		
		console.log('my nigga')
		var oauth = new OAuth.OAuth (
			'https://api.fitbit.com/oauth/request_token',
			'https://api.fitbit.com/oauth/access_token',
			config.fitbitClientKey,
			config.fitbitClientSecret,
			'1.0',
			null,
			'HMAC-SHA1'
		);

		oauth.post(
			'https://api.fitbit.com/1/user/-/apiSubscriptions/' + profile.id + '-all.json',
			token,
			tokenSecret,
			null,
			null,
			function(err, data, res) {
				if (err) console.error(err);
				console.log("update");
				return done(null, profile);
			}
		);
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
  passport.authenticate('fitbit', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


http.createServer(app).listen(app.get('port'), function() {
	console.log('express server listening on port ' + app.get('port'));
});
