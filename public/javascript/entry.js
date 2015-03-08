var TweetStream = require('./TweetStream'),
    TweetFilter = require('./TweetFilter'),
    TweetModel = require('./TweetModel');

var React = require('react');

    React.addons = require('react/addons').addons;

var Tweets = require('./views/Tweets'),
    Tags = require('./views/Tags'),
    Languages = require('./views/Languages'),
    ErrorView = require('./views/Errors'),
    reactMixins = require('./reactMixins');

document.addEventListener('DOMContentLoaded', function() {
    "use strict";

    const App = React.createClass({
        getInitialState: function(){
            return {
                errors: [],
                tweetsRate: 1
            }
        },
        handleWSError: function(event) {
            let errors = this.state.errors;
            errors.push(new Error("Could not connect to stream the tweets"));
            this.setState({
                errors
            });
        },
        componentWillMount: function() {
            const tweetFilter = new TweetFilter();
            const tweetStream = new TweetStream(location.origin.replace(/^http/, 'ws'), {onerror: this.handleWSError});
            const tweetModel = new TweetModel(tweetStream);

            this.setState({
                tweetFilter,
                tweetStream,
                tweetModel
            });
        },
        tweetRateUpdate: function (e) {
            const tweetsRate = e.currentTarget.value;
            this.setState({
                tweetsRate
            });
            this.state.tweetStream.send(
                JSON.stringify(
                    {
                        type: 'rate',
                        rate: tweetsRate
                    }
                )
            );
        },
        render: function() {
            return (
                <section >
                    <div id="tweetSettings">
                        <label htmlFor='tweetRate'>Max tweets per second:</label>
                        <input type='range' id='tweetRate' min='1'  onChange={this.tweetRateUpdate}  value={this.state.tweetsRate} max='10' step='1'/>
                        <output htmlFor='tweetRate' id='tweetRateOutput'>{this.state.tweetsRate}</output>
                    </div>

                    <section id="tweetsContainer">
                        < Tweets tweetFilter={this.state.tweetFilter} tweetModel={this.state.tweetModel} />
                    </section>

                    <div className="statistics">
                        < Languages  tweetFilter={this.state.tweetFilter} tweetModel={this.state.tweetModel}  />
                        < Tags tweetFilter={this.state.tweetFilter} tweetModel={this.state.tweetModel} />
                    </div>

                    <ErrorView errors={this.state.errors}/>
                </section>
            )
        }
    });

    React.render(
        < App />,
        document.getElementById('app')
    )
});

/**
 * Returns an onchange listener to send an updated tweet rate value back to the given tweetStream, and will update the label
 * for the DOM node.
 * @param tweetStream
 * @param node node to update label for
 * @returns {Function} onchange listener
 */