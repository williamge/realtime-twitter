"use strict";

const events = require('events');

/**
 * Class acting as an interface for interacting with a stream of tweets (presumably taken from the Twitter stream API).
 * Is observable and emits an event for tweets (with emit message 'tweet') and one for messages (with emit message 'message').
 * @param websocketConnection Active connection to a websocket, will not interact with websocket, simply used for resource cleanup.
 * @param tweetStream A TwitterStream instance providing the class with a source of tweets to provide an interface to.
 */
function tweetProvider(websocketConnection, tweetStream) {
    this.ws = websocketConnection;

    var lastSentTimestamp = -1;

    this.tweetsPerSecondRate = 1;
    this.millisecondsUntilTweet = (1 / this.tweetsPerSecondRate) * 1000;

    function receiveTweet(tweet) {

        //messages/non-tweets have only one key, which is the type of message they are
        if (Object.keys(tweet).length > 1) {
            var currentTimestamp = new Date();

            if (currentTimestamp - lastSentTimestamp > this.millisecondsUntilTweet) {
                this.emit('tweet', tweet);
                lastSentTimestamp = new Date();
            }

        } else {
            this.emit('message', tweet);
            //TODO: consider throwing this to unimportant logging using winston
            //console.log('discarded tweet: ' + tweet);
        }
    }

    const boundReceiveTweet = receiveTweet.bind(this);

    tweetStream.on('tweet', boundReceiveTweet);

    this.ws.on('close', function() {
        //disconnect listeners, etc.
        tweetStream.removeListener('tweet', boundReceiveTweet);
    });
}

tweetProvider.prototype = Object.create(events.EventEmitter.prototype);
tweetProvider.prototype.constructor = tweetProvider;

/**
 * Sets the rate of tweets to be sent per second
 * @param newRate Number of tweets per second for this instance to emit (maximum, not guaranteed to be accurate)
 */
tweetProvider.prototype.setRate = function(newRate) {
    this.tweetsPerSecondRate = newRate;
    this.millisecondsUntilTweet = (1 / this.tweetsPerSecondRate) * 1000;
};

module.exports = tweetProvider;
