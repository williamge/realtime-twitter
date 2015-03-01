var asEvent = require('./event');

function TweetFilter() {
    this.listeners = [];
    this.languageFilter = null;
}

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

asEvent(TweetFilter);

module.exports = TweetFilter;