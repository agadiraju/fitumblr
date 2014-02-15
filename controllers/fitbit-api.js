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

function getWeekStats

//ask jeremy: the fuck is this
function notificationsReceived(req, res)
{
    res.send(204);
    
    //verify it's Fitibit
    fs.read
}

module.exports.getWeekStats = getWeekStats;
