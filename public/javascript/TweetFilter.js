"use strict";

const asEvent = require('./event'),
    mixin = require('./mixin');

/**
 * Creates tweet filter objects to be used for filtering through tweets. Uses extensible filter system for filtering.
 * Implements event interface, and is observable.
 * @constructor
 */
function TweetFilter() {
    this.languageFilter = null;
    this.filter = null;

    this._applyMixins();
}
mixin.apply(TweetFilter, [asEvent]);

/**
 * Interface for filters to be used by TweetFilter. All implementations must override #isMatched function.
 */
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

/**
 * For filtering tweets by language they are written in
 */
class language extends baseFilter {
    constructor(languageValue) {
        this.filterValue = languageValue;
    }

    isMatched(tweet) {
        return tweet.lang === this.filterValue;
    }
};

/**
 * For filtering tweets based on hashtags they contain
 */
class tag extends baseFilter {
    isMatched(tweet) {
        return tweet.entities.hashtags.some((tweetTag) => { return tweetTag.text === this.filterValue; });
    }
}

/**
 * Enumerator for types of (default) filters.
 * @type {{}}
 */
TweetFilter.types = {
    language,
    tag
};

/**
 * Enumerator for possible messages to be dispatched from TweetFilter
 * @type {{filterChange: string}}
 */
TweetFilter.messageTypes = {
    filterChange: 'filterChange'
};

/**
 * Sets the current filter for this instance to the supplied filter and value
 * @param filterType Filter class to be set, must conform to baseFilter interface.
 * @param value will be used with filterType as the value to compare tweets with by the filter
 */
TweetFilter.prototype.setFilter = function (filterType, value) {
    if (Object.getPrototypeOf(filterType) !== baseFilter) {
        throw new TypeError("type must be an instanceof baseFilter.");
    } else {
        this.filter = new filterType(value);
        this.dispatchEvent(TweetFilter.messageTypes.filterChange, this.filter);
    }
};

/**
 * Removes the currently set filter.
 */
TweetFilter.prototype.removeFilter = function() {
    this.filter = null;
    this.dispatchEvent(TweetFilter.messageTypes.filterChange, this.filter);
};

/**
 * Returns true if the given value is currently used for the filter to compare to, false otherwise.
 * @param value
 * @returns Boolean
 */
TweetFilter.prototype.isActive = function(value) {
    if (this.filter === null || this.filter === undefined) {
        return false;
    } else {
        return this.filter.isActive(value);
    }
};

/**
 * Returns true if the given tweet matches filter (or no filter is set), false otherwise.
 * @param tweet
 * @returns {*}
 */
TweetFilter.prototype.tweetMatchesFilter = function(tweet) {
    if (!this.filter) {
        return true;
    } else {
        return this.filter.isMatched(tweet);
    }
};

module.exports = TweetFilter;