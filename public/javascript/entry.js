var TweetStream = require('./TweetStream'),
    TweetFilter = require('./TweetFilter'),
    TweetModel = require('./TweetModel');

var React = require('react');

    React.addons = require('react/addons').addons;

var Tweets = require('./views/Tweets'),
    Tags = require('./views/Tags'),
    Languages = require('./views/Languages'),
    reactMixins = require('./reactMixins');


document.addEventListener('DOMContentLoaded', function() {

    var tweetFilter = new TweetFilter();
    var tweetStream = new TweetStream(location.origin.replace(/^http/, 'ws'));

    var tweetRate = document.getElementById('tweetRate');
    tweetRate.addEventListener('change', tweetRateUpdater(tweetStream, document.getElementById('tweetRateOutput')));

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    var tweetModel = new TweetModel(tweetStream);

    React.render(
        < Tweets tweetFilter={tweetFilter} tweetModel={tweetModel} />,
        document.getElementById('tweetsContainer')
    );


    var Statistics = React.createClass({
        render: function() {
            return (
                <div>
                    < Languages  tweetFilter={tweetFilter} tweetModel={tweetModel}  />
                    < Tags tweetFilter={tweetFilter} tweetModel={tweetModel} />
                </div>
            );
        }
    });

    React.render(
        < Statistics />,
        document.getElementById('statistics')
    );

});

/**
 * Returns an onchange listener to send an updated tweet rate value back to the given tweetStream, and will update the label
 * for the DOM node.
 * @param tweetStream
 * @param node node to update label for
 * @returns {Function} onchange listener
 */
function tweetRateUpdater(tweetStream, node) {
    return function onTweetRateChange(e) {

        node.value = e.currentTarget.value;
        tweetStream.send(
            JSON.stringify(
                {
                    type: 'rate',
                    rate: tweetRateOutput.value
                }
            )
        );
    };
}