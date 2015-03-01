const React = require('react'),
    reactMixins = require('../reactMixins');

const TimeoutTransitionGroup = require('../KhanReactComponents/js/timeout-transition-group.jsx');

const TweetModel = require('../TweetModel'),
    TweetFilter = require('../TweetFilter');


const TagsItem =  React.createClass({
    propTypes: {
        tweetFilter: React.PropTypes.object.isRequired
    },
    setTag: function() {
        this.props.tweetFilter.setFilter(TweetFilter.types.tag, this.props.tag);
    },
    render: function () {
        var classText = this.props.active ? 'tag-active' : 'tag';
        var style = {
            'backgroundSize': this.props.mwidth.toString() + 'px 100%'
        };
        return (
            <li onClick={this.setTag} className={classText} style={style}>
                <span>{this.props.tag}:</span>
                <span>{this.props.count}</span>
            </li>
        );
    }
});


module.exports = React.createClass({
    mixins: [reactMixins.statisticsMixin, reactMixins.widthMixins],
    propTypes: {
        tweetModel: React.PropTypes.object.isRequired,
        tweetFilter: React.PropTypes.object.isRequired
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
    },
    render: function () {
        var sortedList = this.getListForRender(this.state.contents);
        var sumOfList = this.getSum(sortedList);

        var renderedList = sortedList.map(function (tagTuple) {
            const {tag, count} = {tag: tagTuple[0], count: tagTuple[1]};

            var isActive = this.props.tweetFilter.isActive(tag);
            var childWidth = this.getChildWidth(count, sumOfList, this.state.myWidth);
            return (
                <TagsItem key={tag} tag={tag} count={count} active={isActive} mwidth={childWidth} tweetFilter={this.props.tweetFilter} />
            );
        }.bind(this));
        if (renderedList.length === 0) {
            renderedList.push(
                <li>
                    <span>No Tags to show yet</span>
                </li>
            )
        }
        return (
            <div>
                <label>Tags:</label>
                <ul  className="tags">
                    <TimeoutTransitionGroup transitionName='animFadeIn' enterTimeout={250} leaveTimeout={250} >
                        {renderedList}
                    </TimeoutTransitionGroup>
                </ul>
            </div>
        );
    }
});
