const React = require('react'),
    reactMixins = require('../reactMixins'),
    Statistics = require('./Statistics');

const TimeoutTransitionGroup = require('../KhanReactComponents/js/timeout-transition-group.jsx');

const TweetModel = require('../TweetModel'),
    TweetFilter = require('../TweetFilter');

function TagsItem(tweetFilter) {
    return React.createClass({
        setTag: function () {
            tweetFilter.setFilter(TweetFilter.types.tag, this.props.value);
        },
        render: function () {
            var classText = this.props.active ? 'tag-active' : 'tag';
            var style = {
                'backgroundSize': this.props.mwidth.toString() + 'px 100%'
            };
            return (
                <li onClick={this.setTag} className={classText} style={style}>
                    <span>{this.props.value}:</span>
                    <span>{this.props.count}</span>
                </li>
            );
        }
    });
}


const text = {
    'NoContents': 'No Tags to show yet'
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
                    var oldTags = this.state.contents;
                    var tags = tweet.entities.hashtags;
                    tags.forEach(function (tag) {
                        oldTags[tag.text] = (oldTags[tag.text] || 0) + 1
                    });
                    this.setState({contents: oldTags});
                }
            }
        );
        const tweetFilter = this.props.tweetfilter;
        //Only need to do this in state because we need to pass it a TweetFilter instance,
        //which we're getting from our props
        this.setState({
            TagsItem: TagsItem(tweetFilter)
        });
    },
    isActive: function(key) {
        return this.props.tweetFilter.filter instanceof TweetFilter.types.tag &&
            this.props.tweetFilter.isActive(key);
    },
    render: function () {
        let removeFilter = null;
        if (this.props.tweetFilter.filter instanceof TweetFilter.types.tag) {
            removeFilter = (
                <button className="remove-filter-button" onClick={this.removeFilter} >Remove filter</button>
            )
        }

        return (
            <Statistics
                data={this.state.contents}
                isActive={this.isActive}
                repeatingItem={this.state.TagsItem}
                text={text}
                topButton={removeFilter}
                class="tags"
                transitionName="animFadeIn"
                transitionTimeout={transitionTimeout}
            />
        )
    }
});