var React = require('react');

React.addons = require('react/addons').addons;

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var Tweets = function(tweetStream, tweetFilter) {

    return React.createClass({
        getInitialState: function () {
            return {
                tweets: [],
                tweetStream: tweetStream,
                tweetFilter: tweetFilter
            };
        },
        componentDidMount: function () {
            this.state.tweetStream.addListener(function (tweet) {
                var oldTweets = this.state.tweets;
                oldTweets.unshift(tweet);
                this.setState({tweets: oldTweets});
            }.bind(this));

            //if performance gets to be a problem, we can just disable this, the tweets will be forcing a state update often enough to make up for not listening to this event
            this.state.tweetFilter.addListener(function (message) {
                if (message === 'languageFilterChange') {
                    this.forceUpdate();
                }
            }.bind(this));
        },
        render: function () {
            var tweets = [];
            this.state.tweets.some(function (tweet) {
                if (tweets.length >= 20) {
                    return true;
                }
                if (this.state.tweetFilter.tweetMatchesFilter(tweet)) {
                    tweets.push(
                        <li className="tweet" key={tweet.id_str}>
                            <img src={tweet.user.profile_image_url} />
                            <span>{tweet.user.name} - </span>
                            <a href={ "https://twitter.com/" + tweet.user.screen_name}>@{tweet.user.screen_name}</a>
                            <p>{tweet.text}</p>
                        </li>
                    );
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
    })
};

module.exports = Tweets;