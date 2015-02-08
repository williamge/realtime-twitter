"use strict";

var WSS = require('ws').Server,
    http = require('http'),
    express = require('express'),
    app = express(),
    port = process.env.PORT || 5000;

var crypto = require('crypto');

app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = http.createServer(app);
server.listen(port);

var wss = new WSS({
    server: server
});
console.log('ws server created');

var twitterStream = require('./twitterStream').stream;
var tweetProvider = require('./tweetProvider');

var tweetStream = new twitterStream();

wss.on('connection', function(ws) {
    var wsID = crypto.randomBytes(4).toString('hex');

    console.log('ws connection open: ' + wsID);
    ws.send('test');

    var tweets = new tweetProvider(ws, tweetStream);

    var relayTweet = function(tweet) {
        ws.send(tweet.text, function wsSendCallback(err) {
            if (err) {
                console.log(err);
            }
        });
    };

    var boundRelayTweet = relayTweet.bind(this);

    tweets.on('tweet', boundRelayTweet);

    ws.on('close', function() {
        console.log('wss connection closed: ' + wsID);
        tweets.removeListener('tweet', boundRelayTweet)
    })
});

console.log('http server listening');
