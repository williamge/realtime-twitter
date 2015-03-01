"use strict";

const asEvent = require('./event');

function TweetFilter() {
    this.languageFilter = null;
    this.filter = null;
}
asEvent(TweetFilter);

class baseFilter {
    constructor(value) {
        this.filterValue = value;
    }

    isMatched(tweet) {
        throw new TypeError("Function isMatched() from baseFilter needs to be overridden.");
    }

    isActive(value) {
        return this.filterValue === value;
    }
}

class language extends baseFilter {
    constructor(languageValue) {
        this.filterValue = languageValue;
    }

    isMatched(tweet) {
        return tweet.lang === this.filterValue;
    }
};

class tag extends baseFilter {
    isMatched(tweet) {
        return tweet.entities.hashtags.some((tweetTag) => { return tweetTag.text === this.filterValue; });
    }
}

TweetFilter.types = {
    language,
    tag
};

TweetFilter.messageTypes = {
    filterChange: 'filterChange'
};

TweetFilter.prototype.setFilter = function (filterType, value) {
    if (Object.getPrototypeOf(filterType) !== baseFilter) {
        throw new TypeError("type must be an instanceof baseFilter.");
    } else {
        this.filter = new filterType(value);
        this.dispatchEvent(TweetFilter.messageTypes.filterChange, this.filter);
    }
};

TweetFilter.prototype.removeFilter = function() {
    this.filter = null;
    this.dispatchEvent(TweetFilter.messageTypes.filterChange, this.filter);
};

TweetFilter.prototype.isActive = function(value) {
    if (this.filter === null || this.filter === undefined) {
        return false;
    } else {
        return this.filter.isActive(value);
    }
};

TweetFilter.prototype.tweetMatchesFilter = function(tweet) {
    if (!this.filter) {
        return true;
    } else {
        return this.filter.isMatched(tweet);
    }
};

module.exports = TweetFilter;