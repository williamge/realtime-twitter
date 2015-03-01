function asEvent(obj) {
    "use strict";

    let state = {
        listeners: []
    };

    obj.prototype.dispatchEvent = function dispatchEvent(message, data) {
        state.listeners.forEach(function(cb) {
            cb(message, data);
        });
    };

    obj.prototype.addListener = function addListener(cb) {
        state.listeners.push(cb);
    };
}

module.exports = asEvent;

