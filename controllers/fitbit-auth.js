var env = process.env.NODE_ENV || 'production',
	config = require('../config')[env];

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

passport.use(new FitBitStrategy({
                consumerKey: config.fitbitClientKey,
		consumerSecret: config.fitbitClientSecret,
		callbackURL: "http://" + config.host + "auth/fitbit/callback"
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
	
