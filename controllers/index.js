var env = process.env.NODE_ENV || 'production',
	config = require('../config')[env];

// Index page that asks the user to sign in with Fitbit
module.exports.index = function(req, res) {
  console.log(req.user);
	res.render('../views/index.ejs');
}

//something to link Tumblr to website
