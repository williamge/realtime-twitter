"use strict";

var React = require('react');

React.addons = require('react/addons').addons;

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TweetModel = require('../TweetModel');


module.exports = React.createClass({
    propTypes: {
        tweetModel: React.PropTypes.object.isRequired,
        tweetFilter: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            tweets: []
        };
    },
    componentDidMount: function () {
        this.props.tweetModel.addListener((message) => {
            if (message === TweetModel.messageTypes.newTweet) {
                this.setState({tweets: this.props.tweetModel.getTweets()});
            }
        });

        //if performance gets to be a problem, we can just disable this, the tweets will be forcing a state update often enough to make up for not listening to this event
        this.props.tweetFilter.addListener(function (message) {
            if (message === 'languageFilterChange') {
                this.forceUpdate();
            }
        }.bind(this));
    },
    render: function () {
        var tweets = [];
        var matchedTweets = 0;
        this.state.tweets.some(function (tweet) {
            if (matchedTweets >= 20) {
                return true;
            }
            if (this.props.tweetFilter.tweetMatchesFilter(tweet)) {
                tweets.push(
                    <li className="tweet" key={tweet.id_str}>
                        <img src={tweet.user.profile_image_url} />
                        <span>{tweet.user.name} - </span>
                        <a href={ "https://twitter.com/" + tweet.user.screen_name}>@{tweet.user.screen_name}</a>
                        <p>{tweet.text}</p>
                    </li>
                );
                matchedTweets++;
            }

        }.bind(this));
        return (
            <ul id="tweets">
                <ReactCSSTransitionGroup transitionName="animFadeIn">
                    {tweets}
                </ReactCSSTransitionGroup>
            </ul>
        );
    }
});

