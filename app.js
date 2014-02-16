var env = process.env.NODE_ENV || 'production',
	config = require('./config')[env];


var express = require('express');
	http = require('http'),
	OAuth = require('oauth'),
	passport = require('passport');

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
app.get('/auth/fitbit/callback', passport.authenticate('fitbit', {failureReDirect: '/?error=auth-failed' }),
	function(req, res) {
		res.redirect('/');
	}
);


http.createServer(app).listen(app.get('port'), function() {
	console.log('express server listening on port ' + app.get('port'));
});
