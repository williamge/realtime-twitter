
var widthMixins = {
    getInitialState: function () {
        return {
            myWidth: 0
        };
    },
    updateDimensions: function () {
        this.setState({myWidth: this.getDOMNode().offsetWidth});
    },
    componentDidMount: function () {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.updateDimensions);
    }
};

var statisticsMixin = {
    getInitialState: function () {
        return {
            contents: {}
        };
    },
    getChildWidth: function(count, sum, width) {
        return (( count / sum) * width ) || 0;
    },
    getInfoForRender: function(contents) {
        var contentsList = Object.keys(contents).map(function (contentName) {
            return [contentName, contents[contentName]];
        }).sort(function (a, b) {
            return b[1] - a[1];
        }).slice(0, 14);

        var contentsSum = contentsList.reduce(function (sum, content) {
            return sum + content[1];
        }, 0);

        return {
            list: contentsList,
            sum: contentsSum
        };
    },
    getListForRender: function(contents) {
        var contentsList = Object.keys(contents).map(function (contentName) {
            return [contentName, contents[contentName]];
        }).sort(function (a, b) {
            return b[1] - a[1];
        }).slice(0, 14);

        return contentsList;
    },
    getSum: function(contents) {
        var contentsSum = contents.reduce(function (sum, content) {
            return sum + content[1];
        }, 0);

        return contentsSum;
    }
};

module.exports = {
    widthMixins: widthMixins,
    statisticsMixin: statisticsMixin
};