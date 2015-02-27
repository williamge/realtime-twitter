function TweetModel(tweetStream) {
    this.tweetStream = tweetStream;
    this.tweets = [];
    this.listeners = [];
    this.tweetStream.addListener(this.onNewTweet.bind(this));
}

TweetModel.messageTypes = {
    newTweet: Symbol('newTweet')
};

TweetModel.prototype.onNewTweet = function(tweet) {
    this.tweets.unshift(tweet);

    //nothing magical about this number, just needed something big, at some point this should be replaced with
    //smarter behaviour and not just blanket truncating to a certain number
    this.tweets = this.tweets.slice(0, 5000);
    this.dispatchEvent(TweetModel.messageTypes.newTweet, tweet);
};

//TODO: use a mixin, another model/object is using the same structure
TweetModel.prototype.dispatchEvent = function dispatchEvent(message, data) {
    this.listeners.forEach(function(cb) {
        cb(message, data);
    });
};

TweetModel.prototype.addListener = function addListener(cb) {
    this.listeners.push(cb);
};

TweetModel.prototype.getTweets = function() {
    return this.tweets;
};

module.exports = TweetModel;