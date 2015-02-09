"use strict";

var events = require('events');

function tweetProvider(websocketConnection, tweetStream) {
    this.ws = websocketConnection;

    var lastSentTimestamp = -1;

    this.tweetsPerSecondRate = 1;
    this.millisecondsUntilTweet = (1 / this.tweetsPerSecondRate) * 1000;

    function receiveTweet(tweet) {
        var jtweet = JSON.parse(tweet);

        //messages/non-tweets have only one key, which is the type of message they are
        //TODO: move this either in to another layer, or in to twitterstream. If we have a lot of clients connected, why keep redoing all the same work for each of them.
        if (Object.keys(jtweet).length > 1) {
            var currentTimestamp = new Date();

            if (currentTimestamp - lastSentTimestamp > this.millisecondsUntilTweet) {
                this.emit('tweet', jtweet);
                lastSentTimestamp = new Date();
            }

        } else {
            this.emit('message', jtweet);
            console.log('discarded tweet: ' + tweet);
        }
    }

    var boundReceiveTweet = receiveTweet.bind(this);

    tweetStream.on('tweet', boundReceiveTweet);

    this.ws.on('close', function() {
        //disconnect listeners, etc.
        tweetStream.removeListener('tweet', boundReceiveTweet);
    });
}



tweetProvider.prototype = Object.create(events.EventEmitter.prototype);
tweetProvider.prototype.constructor = tweetProvider;

module.exports = tweetProvider;
