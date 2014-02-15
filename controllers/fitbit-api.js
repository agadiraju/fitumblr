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

function getWeekStats(encodedId, callback, api_call) {
	console.log("Getting weekly stats for", encodedId);
	
        var week = [];
	var counter = 0;
	for (var i = 1; i < 8; i++)
	{
        	today = (moment().subtract('days', i).format("YYYY-MM-DD"));
		oauth.get(
			'https://api.fitbit.com/1/user/-/" + api_call + "/date/' + today + '.json',
			user.accessToken,
			user.accessSecret,
			function(err, data, res) {
				if (err) {
					console.error("Error fetching activity data", err);
					callback(err);
					return ;
				}
				
				data = JSON.parse(data);
				console.log("stats for " + today, data);
				day = [today, data];
				week.push(day);
				if (week.length == 7) {
					callback(err, week, api_call);
				}
			}
		);
	}
} 

function dataCallback(err, weekData, api_param) {
	if (err)
	{
		console.error("dataCallback error", err);
		return ;
	}
	
	console.log(weekData);	
}

function notificationsReceived(req, res) {
	// Immediately send HTTP 204 No Content
	res.send(204);

	// TODO: Verify req.headers['x-fitbit-signature'] to ensure it's Fitbit

	fs.readFile(req.files.updates.path, {encoding: 'utf8'}, function (err, data) {
		if (err) console.error(err);
		data = JSON.parse(data);

		// [
		// 	 {
		// 		collectionType: 'activities',
		// 		date: '2013-10-21',
		// 		ownerId: '23RJ9B',
		// 		ownerType: 'user',
		// 		subscriptionId: '23RJ9B-all'
		// 	}
		// ]

		for (var i = 0; i < data.length; i++) {
			console.log(data[i]);
			getWeekStats(data[i].ownerId, dataCallback, "activities");
			getWeekStats(data[i].ownerId, dataCallback, "sleep");
		}
	});
};


module.exports.notificationsReceived = notificationsReceived;
module.exports.getWeekStats = getWeekStats;

