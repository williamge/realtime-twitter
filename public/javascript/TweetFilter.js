
function TweetFilter() {
    this.listeners = [];
    this.languageFilter = null;
}

TweetFilter.prototype.addListener = function addListener(cb) {
    this.listeners.push(cb);
};

TweetFilter.prototype.dispatchEvent = function dispatchEvent(message, data) {
    this.listeners.forEach(function(cb) {
        cb(message, data);
    });
};

TweetFilter.prototype.setLanguageFilter = function(languageCode) {
    this.languageFilter = languageCode;
    this.dispatchEvent('languageFilterChange', this.languageFilter);
};

TweetFilter.prototype.tweetMatchesFilter = function(tweet) {
    if (this.languageFilter !== null ) {
        return tweet.lang === this.languageFilter;
    } else {
        return true;
    }
};

module.exports = TweetFilter;