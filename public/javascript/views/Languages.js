var React = require('react'),
    reactMixins = require('../reactMixins');

var LanguageItem = React.createClass({
    setLanguage: function() {
        tweetFilter.setLanguageFilter(this.props.language);
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

var Languages = function(tweetStream, tweetFilter) {
    return React.createClass({
        mixins: [reactMixins.statisticsMixin, reactMixins.widthMixins],
        getInitialState: function () {
            return {
                tweetStream: tweetStream,
                tweetFilter: tweetFilter
            };
        },
        componentDidMount: function () {
            this.state.tweetStream.addListener(
                function (tweet) {
                    var contents = this.state.contents;
                    var newContents = [tweet.lang];
                    newContents.forEach(function (content) {
                        contents[content] = (contents[content] || 0) + 1
                    });
                    this.setState({contents: contents});
                }.bind(this));

            this.state.tweetFilter.addListener(
                function (message, data) {
                    if (message === 'languageFilterChange') {
                        this.setState({activeLanguage: data});
                    }
                }.bind(this));
        },
        render: function () {
            var sortedList = this.getListForRender(this.state.contents);
            var sumOfList = this.getSum(sortedList);
            var renderedList = sortedList.map(function (tag) {
                var isActive = this.state.activeLanguage === tag[0];
                var childWidth = this.getChildWidth(tag[1], sumOfList, this.state.myWidth);
                return (
                    <LanguageItem  key={tag[0]} language={tag[0]} count={tag[1]} active={isActive} mwidth={childWidth}/>
                );
            }.bind(this));
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
};

module.exports = {
    Languages: Languages
};