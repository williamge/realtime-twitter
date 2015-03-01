"use strict";

const React = require('react');

//TODO: when this addon actually starts working again I should start using it again
//var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const TimeoutTransitionGroup = require('../KhanReactComponents/js/timeout-transition-group.jsx');

const TweetModel = require('../TweetModel');


module.exports = React.createClass({
    propTypes: {
        tweetModel: React.PropTypes.object.isRequired,
        tweetFilter: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            tweets: [],
            tweetsToRender: [],
            frozen: false
        };
    },
    componentDidMount: function () {
        this.props.tweetModel.addListener((message) => {
            if (message === TweetModel.messageTypes.newTweet) {
                this.newTweet();
            }
        });

        this.props.tweetFilter.addListener(function (message) {
            this.newTweet();
        }.bind(this));
    },
    mouseEnterHandler: function() {
        this.setState({frozen: true});
    },
    mouseLeaveHandler: function() {
        this.setState({frozen: false});
    },
    newTweet: function() {
        this.setState({tweets: this.props.tweetModel.getTweets()});
        if (!this.state.frozen) {
            let tweets = [];
            let matchedTweets = 0;
            this.state.tweets.some((tweet) => {
                if (matchedTweets >= 20) {
                    return true;
                }
                if (this.props.tweetFilter.tweetMatchesFilter(tweet)) {
                    tweets.push(tweet);
                    matchedTweets++;
                }

            });
            this.setState({tweetsToRender: tweets});
        }
    },
    render: function () {
        const tweets = this.state.tweetsToRender.map( (tweet) => {
                const tweetPictureWithHTTPS = tweet.user.profile_image_url.replace('http://', 'https://');

                return (
                    <li className="tweet" key={tweet.id_str}>
                        <img src={tweetPictureWithHTTPS} />
                        <span>{tweet.user.name} - </span>
                        <a href={ "https://twitter.com/" + tweet.user.screen_name}>@{tweet.user.screen_name}</a>
                        <p>{tweet.text}</p>
                    </li>
                )
        });

        const hoverDisplay = this.state.frozen ? (
            <div className='frozen-tweets-box' >
                { this.state.tweets.length -  this.state.tweetsToRender.length} new tweets
            </div>
        ) : null;

        return (
            <div id="tweets" onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler} >
                {hoverDisplay}
                <ul >
                    <TimeoutTransitionGroup transitionName='animFadeIn' enterTimeout={250} leaveTimeout={250} >
                        {tweets}
                    </TimeoutTransitionGroup>
                </ul>
            </div>
        );
    }
});

