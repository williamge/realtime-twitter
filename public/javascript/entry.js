var TweetStream = require('./TweetStream'),
    TweetFilter = require('./TweetFilter');

var React = require('react');

    React.addons = require('react/addons').addons;

var TweetsView = require('./views/Tweets'),
    TagsViews = require('./views/Tags'),
    LanguagesViews = require('./views/Languages'),
    reactMixins = require('./reactMixins');


document.addEventListener('DOMContentLoaded', function() {

    var tweetFilter = new TweetFilter();
    var tweetStream = new TweetStream(location.origin.replace(/^http/, 'ws'));

    tweetRateUpdater(tweetStream);


    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    var TweetModel = (function(tweetStream) {
        function TweetModel() {
            this.tweetStream = tweetStream;
            this.tweets = [];
            this.listeners = [];
            this.tweetStream.addListener(this.onNewTweet.bind(this));
        }

        TweetModel.prototype.onNewTweet = function(tweet) {
            this.tweets.unshift(tweet);
            this.dispatchEvent('newTweet');
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
        }


    })(tweetStream);


    var Tweets = TweetsView(tweetStream, tweetFilter);

    React.render(
        < Tweets />,
        document.getElementById('tweetsContainer')
    );


    var Tags = TagsViews.Tags(tweetStream, tweetFilter);

    var Languages = LanguagesViews.Languages(tweetStream, tweetFilter);

    var Statistics = React.createClass({
        render: function() {
            return (
                <div>
                    < Languages />
                    <Tags/>
                </div>
            );
        }
    });

    React.render(
        < Statistics />,
        document.getElementById('statistics')
    );

});

function tweetRateUpdater(tweetStream) {
    var tweetRate = document.getElementById('tweetRate');

    tweetRate.addEventListener('change', function onTweetRateChange(e) {

        var tweetRateOutput = document.getElementById('tweetRateOutput');
        tweetRateOutput.value = e.currentTarget.value;
        tweetStream.send(
            JSON.stringify(
                {
                    type: 'rate',
                    rate: tweetRateOutput.value
                }
            )
        );
    });
}