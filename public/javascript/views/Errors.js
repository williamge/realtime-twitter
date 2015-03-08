"use strict";

const React = require('react');

const TimeoutTransitionGroup = require('../KhanReactComponents/js/timeout-transition-group.jsx');

module.exports = React.createClass({
    propTypes: {
        errors: React.PropTypes.array.isRequired
    },
    render: function () {
        const renderedErrors = this.props.errors.map((error) => {
            return (
                <li className="error-listing">
                    <span className="error-icon">): </span>
                    <p className="error-text">{error.message || "There was an error"}</p>
                </li>
            )
        });

        if (renderedErrors.length) {
            return (
                <ul className="errors-list">
                {renderedErrors}
                </ul>
            )
        } else {
            return null;
        }

    }
});