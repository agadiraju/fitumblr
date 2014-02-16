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
  var weeklySummary = {};
  async.parallel([
    function(callback) {
      getActivityStats(token, secret, callback, "steps");
    },
    function(callback) {
      getActivityStats(token, secret, callback, "calories");
    },
    function(callback) {
     getActivityStats(token, secret, callback, "distance");
    },
    function(callback) {
      getActivityStats(token, secret, callback, "minutesSedentary");
    },
    function(callback) {
      getSleepStats(token, secret, callback, "efficiency");
    },
    function(callback) {
      getSleepStats(token, secret, callback, "awakeningsCount");
    }
  ], function(err, results) { //This function gets called after the two tasks have called their "task callbacks"
    if (err) return next(err);
    results.forEach(function(entry) {
     var total = 0;
      var key = Object.keys(entry)[0];
     entry[Object.keys(entry)[0]].forEach(function(item){
        total = parseInt(total) + parseInt(item.value);
     });
      weeklySummary[key] = total;
   });    
    console.log(weeklySummary);
    res.render('../views/graph.ejs', {
    	weeklySummary: weeklySummary,
    	//personalData: personalData
    });
  });  
};


module.exports.getFitbitData = getFitbitData;
module.exports.ActivityStats = getActivityStats;
module.exports.getSleepStats = getSleepStats;

