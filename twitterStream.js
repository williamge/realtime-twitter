"use strict";

const https = require('https'),
    oauth = require('./oauth'),
    events = require('events');

/**
 * Initiates a stream of tweets from Twitter's stream API. Provides a callback for receiving the HTTP response from Twitter containing
 * the tweets, and also returns the HTTP request (standard Node.js request object) used for the request.
 * @param consumerSecret
 * @param accessSecret
 * @param consumerKey
 * @param accessToken
 * @param cb Callback function that will be called on the HTTP response. Takes one parameter (HTTP response) that will emit 'data' events upon receiving new data from server
 * @returns {*} The originating Node.js HTTP request object for connecting to the Twitter API endpoint
 */
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

/**
 * Class serving as instances of connections to the Twitter streaming API.
 */
function twitterStream() {

    let connectedToAPIStream = false;

    let req;

    const self = this;

    /**
     * Creates a handler for receiving data from an HTTP response. Will emit 'tweet' events on 'this' upon receiving complete tweets.
     * Combines chunks of HTTP response data to complete tweets.
     * @returns {Function} One parameter handler function that will emit 'tweet' events on 'this' object
     */
    const makeDataReceived = function() {
        let body = '';

        const dataReceived = function(d){
            body += d.toString();
            //TODO: consider throwing this to unimportant logging using winston
            //console.log(d.toString());

            // \r\n signals the end of a chunk send by the Twitter API, as per their specs
            if (body.indexOf('\r\n') != -1) {
                this.emit('tweet', JSON.parse(body));
                body = '';
            }
        }.bind(this);

        return dataReceived;

    }.bind(this);


    /**
     * Listens for 'newListener' events on this twitterStream and handles appropriate resource initialization.
     */
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

    /**
     * Listens for 'removeListener' events on this twitterStream and handles appropriate resource cleanup.
     */
    this.on('removeListener', function removedListenerCheck() {
        if (self.listeners('tweet') < 1 && connectedToAPIStream) {
            req.abort();
            connectedToAPIStream = false;
        }
    });
}

twitterStream.prototype = Object.create(events.EventEmitter.prototype);
twitterStream.prototype.constructor = twitterStream;


module.exports = {
    initiateTwitterStream: initiateTwitterStream,
    stream: twitterStream
};
