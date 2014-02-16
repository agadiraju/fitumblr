var fs = require('fs'),
	OAuth = require('oauth');
var env = process.env.NODE_ENV || 'production';
var config = require('../config.js')[env];
var moment = require('moment');
var async = require('async');


var oauth = new OAuth.OAuth('https://api.fitbit.com/oauth/request_token', 
		    'https://api.fitit.com/oauth/access_token',
		    config.fitbitClientKey,
		    config.fitbitClientSecret,
		    '1.0',
		    null,
		    'HMAC-SHA1'
);

function getActivityStats(token, secret, callback, api_call) {	
	console.log("Getting activity stats");

	var today = (moment().utc().format("YYYY-MM-DD"));
	oauth.get(
		'https://api.fitbit.com/1/user/-/activities/' + api_call + '/date/' + today + '/7d.json',
		token,
		secret,
		function(err, data, res) {
			if (err) {
					console.error("Error fetching activity data", err);
					callback(err);
					return ;
			}
				
			data = JSON.parse(data);
			callback(null, data);
			
		}
	);
}

function getSleepStats(token, secret, callback, api_call) {
	console.log("Getting sleep stats");
	
	var today = (moment().utc().format("YYYY-MM-DD"));
    console.log('https://api.fitbit.com/1/user/-/sleep/' + api_call + '/date/' + today + '/7d.json');
	oauth.get(
		'https://api.fitbit.com/1/user/-/sleep/' + api_call + '/date/' + today + '/7d.json',
		token,
		secret,
		function(err, data, res) {
			if (err) {
					console.error("Error fetching sleep data", err);
					callback(err);
					return ;
			}
				
			data = JSON.parse(data);
			
			callback(null, data);
			
		}
	);
}


function getFitbitData(req, res) {
	// Immediately send HTTP 204 No Content

  console.log(req.user.token_info[0]);
  console.log(req.user.token_info[1]);

  var token = req.user.token_info[0];
  var secret = req.user.token_info[1];
  async.parallel([
    function(callback) {
      activityStats = getActivityStats(token, secret, callback, "steps");
    },
    function(callback) {
      SleepStats = getSleepStats(token, secret, callback, "efficiency");
    }
  ], function(err, results) { //This function gets called after the two tasks have called their "task callbacks"
    if (err) return next(err);
    console.log("activity stats for last seven days" + results[0]);
    console.log("sleep stats for last seven days" + results[1]);
    res.render('../views/graph.ejs', {results: results});
  });  


  	// TODO: Verify req.headers['x-fitbit-signature'] to ensure it's Fitbit

	/*fs.readFile(req.files.updates.path, {encoding: 'utf8'}, function (err, data) {
		if (err) console.error(err);
		data = JSON.parse(data);*/

		// [
		// 	 {
		// 		collectionType: 'activities',
		// 		date: '2013-10-21',
		// 		subscriptionId: '23RJ9B-all'
		// 	}
		// ]

		/*for (var i = 0; i < data.length; i++) {
			console.log(data[i]);
			getActivityStats(data[i].ownerId, dataCallback, "steps");
			getSleepStats(data[i].ownerId, dataCallback, "efficiency");
		}*/
	//});
};


module.exports.getFitbitData = getFitbitData;
module.exports.ActivityStats = getActivityStats;
module.exports.getSleepStats = getSleepStats;

