const React = require('react'),
    reactMixins = require('../reactMixins'),
    Statistics = require('./Statistics');

const TimeoutTransitionGroup = require('../KhanReactComponents/js/timeout-transition-group.jsx');

const TweetModel = require('../TweetModel'),
    TweetFilter = require('../TweetFilter');

function LanguageItem (tweetFilter) {
    return React.createClass({
        setLanguage: function () {
            tweetFilter.setFilter(TweetFilter.types.language, this.props.value);
        },
        render: function () {
            var classText = this.props.active ? 'language-active' : 'language';
            var style = {
                'backgroundSize': this.props.mwidth.toString() + 'px 100%'
            };
            return (
                <li onClick={this.setLanguage} className={classText} style={style}>
                    <span>{this.props.value}:</span>
                    <span>{this.props.count}</span>
                </li>
            );
        }
    });
}

const text = {
    'NoContents': 'No languages to show yet'
};

const transitionTimeout = {
    enter: 250,
    leave: 250
};

module.exports = React.createClass({
    propTypes: {
        tweetModel: React.PropTypes.object.isRequired,
        tweetFilter: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            contents: {}
        }
    },
    removeFilter: function() {
        this.props.tweetFilter.removeFilter();
    },
    componentDidMount: function () {
        this.props.tweetModel.addListener(
            (message, tweet) => {
                if (message === TweetModel.messageTypes.newTweet) {
                    var languages = this.state.contents;
                    languages[tweet.lang] = (languages[tweet.lang] || 0) + 1;
                    this.setState({contents: languages});
                }
            }
        );
        const tweetFilter = this.props.tweetFilter;
        //Only need to do this in state because we need to pass it a TweetFilter instance,
        //which we're getting from our props
        this.setState({
            LanguageItem : LanguageItem(tweetFilter)
        });
    },
    isActive: function(key) {
        return this.props.tweetFilter.filter instanceof TweetFilter.types.language &&
            this.props.tweetFilter.isActive(key);
    },
    render: function () {
        let removeFilter = null;
        if (this.props.tweetFilter.filter instanceof TweetFilter.types.language) {
            removeFilter = (
                <button className="remove-filter-button" onClick={this.removeFilter} >Remove filter</button>
            )
        }

        return (
            <Statistics
                data={this.state.contents}
                isActive={this.isActive}
                repeatingItem={this.state.LanguageItem}
                text={text}
                topButton={removeFilter}
                class="languages"
                transitionName="animFadeIn"
                transitionTimeout={transitionTimeout}
            />
        )
    }
});
