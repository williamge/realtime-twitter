const asEvent = require('./event'),
    mixin = require('./mixin');

/**
 * Model for holding tweets, requires a TweetStream instance for construction and will use tweetStream to retrieve tweets.
 * Is observable through the events mixin.
 * @param tweetStream
 * @constructor
 */
function TweetModel(tweetStream) {
    this.tweetStream = tweetStream;
    this.tweets = [];
    this.tweetStream.addListener(this.onNewTweet.bind(this));

    this._applyMixins();
}

/**
 * Enumerator for possible messages to be sent
 * @type {{newTweet: string}}
 */
TweetModel.messageTypes = {
    newTweet: 'newTweet'
};

/**
 * Listener to be attached to tweetStream for listening to new tweets being received. Updates the stored tweets list on receiving a new tweet.
 * @private
 * @param tweet
 */
TweetModel.prototype.onNewTweet = function(tweet) {
    this.tweets.unshift(tweet);

    //nothing magical about this number, just needed something big, at some point this should be replaced with
    //smarter behaviour and not just blanket truncating to a certain number
    this.tweets = this.tweets.slice(0, 5000);

    this.dispatchEvent(TweetModel.messageTypes.newTweet, tweet);
};

/**
 * Returns the array of tweets stored in the instance of this model. Not guaranteed to be mutated/be a reference to current list of tweets.
 * @returns {Array}
 */
TweetModel.prototype.getTweets = function() {
    return this.tweets;
};

mixin.apply(TweetModel, [asEvent]);

module.exports = TweetModel;