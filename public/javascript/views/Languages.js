var React = require('react'),
    reactMixins = require('../reactMixins');

var TweetModel = require('../TweetModel');

var LanguageItem = React.createClass({
    propTypes: {
        tweetFilter: React.PropTypes.object.isRequired
    },
    setLanguage: function() {
        this.props.tweetFilter.setLanguageFilter(this.props.language);
    },
    render: function() {
        var classText = this.props.active ? 'language-active' : 'language';
        var style = {
            'backgroundSize': this.props.mwidth.toString() + 'px 100%'
        };
        return (
            <li onClick={this.setLanguage} className={classText} style={style}>
                <span>{this.props.language}:</span>
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
                    var contents = this.state.contents;
                    var newContents = [tweet.lang];
                    newContents.forEach(function (content) {
                        contents[content] = (contents[content] || 0) + 1
                    });
                    this.setState({contents: contents});
                }
            });

        this.props.tweetFilter.addListener(
            (message, data) => {
                if (message === 'languageFilterChange') {
                    this.setState({activeLanguage: data});
                }
            });
    },
    render: function () {
        var sortedList = this.getListForRender(this.state.contents);
        var sumOfList = this.getSum(sortedList);
        var renderedList = sortedList.map( (tag) => {
            var isActive = this.state.activeLanguage === tag[0];
            var childWidth = this.getChildWidth(tag[1], sumOfList, this.state.myWidth);
            return (
                <LanguageItem  key={tag[0]} language={tag[0]} count={tag[1]} active={isActive} mwidth={childWidth} tweetFilter={this.props.tweetFilter}/>
            );
        });
        if (renderedList.length === 0 ) {
            renderedList.push(
                <li><span>No languages to show yet</span></li>
            )
        }
        return (
            <div>
                <label>Languages:</label>
                <ul className="languages">
                            {renderedList}
                </ul>
            </div>
        );
    }
});