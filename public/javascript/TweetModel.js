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
    return this.tweets.slice(0, 20);
};

module.exports = TweetModel;