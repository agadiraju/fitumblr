var fs = require('fs'),
	OAuth = require('oauth');
var env = process.env.NODE_ENV || 'production';
var config = require('../config.js')[env];
var moment = require('moment');

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
			console.log("activity stats for last seven days" + data);

			callback(err, data, api_call);
			
		}
	);
}

function getSleepStats(token, secret, callback, api_call) {
	console.log("Getting sleep stats");
	
	var today = (moment().utc().format("YYYY-MM-DD"));
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
			console.log("sleep stats for last seven days" + data);

			callback(err, data, api_call);
			
		}
	);
}




function dataCallback(err, weekData, api_param) {
	if (err)
	{
		console.error("dataCallback error", err);
		return ;
	}
	
	console.log("in callback")
	console.log(weekData);	
}

function getFitbitData(req, res) {
	// Immediately send HTTP 204 No Content
	res.send(204);

  console.log(req.user.token_info[0]);
  console.log(req.user.token_info[1]);

  var token = req.user.token_info[0];
  var secret = req.user.token_info[1];
  getActivityStats(token, secret, dataCallback, "steps");
  getSleepStats(token, secret, dataCallback, "efficiency");
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

