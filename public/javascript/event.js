"use strict";
/**
 * Mixin to be used with 'mixin' module. Will make obj observable and expose methods for listening to and dispatching events
 * through obj.
 * @param obj Object to apply mixin to
 */
function asEvent(obj) {

    obj.prototype._mixinCtors.push(
        function eventCtor() {
            this._mixinState._event = {
                listeners: []
            };
        }
    );

    /**
     * Dispatches a message and optional data to all listeners for the object
     * @param message
     * @param data optional data to be sent with the message
     */
    obj.prototype.dispatchEvent = function dispatchEvent(message, data) {
        this._mixinState._event.listeners.forEach(function(cb) {
            cb(message, data);
        });
    };

    /**
     * Attaches a listener for events to the object
     * @param cb callback function for events to be disaptched to
     */
    obj.prototype.addListener = function addListener(cb) {
        this._mixinState._event.listeners.push(cb);
    };
}

module.exports = asEvent;

