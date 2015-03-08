const React = require('react'),
    reactMixins = require('../reactMixins');

const TimeoutTransitionGroup = require('../KhanReactComponents/js/timeout-transition-group.jsx');

module.exports = React.createClass({
    mixins: [reactMixins.statisticsMixin, reactMixins.widthMixins],
    propTypes: {
        data: React.PropTypes.object,
        isActive: React.PropTypes.func,
        //Should be a react class, but react didn't like that being passed in as an element
        repeatingItem: React.PropTypes.func,
        text: React.PropTypes.object,
        topButton: React.PropTypes.element,
        class: React.PropTypes.string,
        transitionName: React.PropTypes.string,
        transitionTimeout: React.PropTypes.shape({
            enter: React.PropTypes.number,
            leave: React.PropTypes.number
        })
    },
    render: function () {
        var sortedList = this.getListForRender(this.props.data);
        var sumOfList = this.getSum(sortedList);

        var renderedList = sortedList.map( (tuple) => {
            const [value, count] = tuple;

            var isActive = this.props.isActive(value);
            var childWidth = this.getChildWidth(count, sumOfList, this.state.myWidth);
            return (
                <this.props.repeatingItem key={value} value={value} count={count} active={isActive} mwidth={childWidth}/>
            );
        });
        if (renderedList.length === 0) {
            if (this.props.text['NoContents'] !== undefined || this.props.text['NoContents'] !== null) {

                const innerText = this.props.text['NoContents'];

                renderedList.push(
                    <li>
                        <span>{innerText}</span>
                    </li>
                )
            }
        }

        return (
            <div>
                <label>Tags:</label>  {this.props.topButton}
                <ul className={this.props.class}>
                    <TimeoutTransitionGroup
                        transitionName={this.props.transitionName}
                        enterTimeout={this.props.transitionTimeout.enter}
                        leaveTimeout={this.props.transitionTimeout.leave} >
                        {renderedList}
                    </TimeoutTransitionGroup>
                </ul>
            </div>
        );
    }
});
