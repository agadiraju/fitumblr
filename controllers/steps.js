var env = process.env.NODE_ENV || 'production',
	config = require('../config')[env];

// Index page that asks the user to sign in with Fitbit
module.exports.steps = function(req, res) {
  FitBitStrategy.
	res.render('../views/index.ejs');
}

//something to li
oauth.get(
  'http://api.fitbit.com/1/user/-/activities/calories/date/today/7d.json',
  token,
  tokenSecret,
  function(err, data, res) {
    if (err) console.error(err);
    console.log("update" + data);
    return done(null, profile);
  }
);
