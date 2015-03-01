"use strict";

var https = require('https'),
    oauth = require('./oauth'),
    events = require('events');

function initiateTwitterStream(consumerSecret, accessSecret, consumerKey, accessToken, cb) {

    var key = oauth.getOAuthKey(consumerSecret, accessSecret);

    console.log('consumerkey: ' + consumerKey);
    console.log('token: ' + accessToken);

    var timestamp = oauth.simpleTimestamp();
    console.log('timestamp: ' + timestamp);
    var nonce = oauth.simpleNonce();
    console.log('nonce: ' + nonce);

    var text = oauth.getRequestText(
        'GET',
        'https://stream.twitter.com/1.1/statuses/sample.json',
        consumerKey,
        accessToken,
        timestamp,
        nonce
    );
    console.log(text);


    var signature = oauth.getSignature(key, text);

    console.log('--');
    console.log(signature);

    var oauthHeader = 'OAuth ' + 'oauth_consumer_key="' + consumerKey + '",' + ' oauth_nonce="' + nonce + '",' + ' oauth_signature="' + signature + '", oauth_signature_method="HMAC-SHA1",' + ' oauth_timestamp="' + timestamp + '", oauth_token="' + accessToken + '",' + ' oauth_version="1.0"';

    var responses = [];

    cb = cb || function placeHolderCallback(res) {
        res.abort();
        throw new Error('Callback to initiateTwitterStream is not optional');
    };

    var req = https.request({
        hostname: "stream.twitter.com",
        path: '/1.1/statuses/sample.json',
        headers: {
            'Authorization': oauthHeader
        },
        method: 'GET'
    }, cb);
    req.end();

    return req;
}


function twitterStream() {

    var connectedToAPIStream = false;

    var req;

    var self = this;

    function makeDataReceived() {
        var counter = 0;
        var body = '';

        return function dataReceived(d) {
            counter++;
            body += d.toString();
            //TODO: consider throwing this to unimportant logging using winston
            //console.log(d.toString());

            if (body.indexOf('\r\n') != -1) {
                self.emit('tweet', body);
                body = '';
            }
        }

    }



    this.on('newListener', function newListenerListener(event) {
        if (event === 'tweet' && !connectedToAPIStream) {
            req = initiateTwitterStream(
                process.env.consumerSecret,
                process.env.accessSecret,
                process.env.consumerKey,
                process.env.accessToken,
                function initiateStream(res) {
                    connectedToAPIStream = true;

                    res.on('data', makeDataReceived());
                }
            )
        }
    });

    this.on('removeListener', function removedListenerCheck() {
        if (self.listeners('tweet') < 1 && connectedToAPIStream) {
            req.abort();
            connectedToAPIStream = false;
        }
    });

    self.emit('tweet', JSON.stringify(new Date()));
}



twitterStream.prototype = Object.create(events.EventEmitter.prototype);
twitterStream.prototype.constructor = twitterStream;


module.exports = {
    initiateTwitterStream: initiateTwitterStream,
    stream: twitterStream
};
