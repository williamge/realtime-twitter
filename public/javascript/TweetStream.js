"use strict";

//TODO: correct this documentation when moving to mixin
/**
 * Class for interfacing with server over websocket connection. Will connect to the websocket server at wsURL and send tweets out to
 * any attached listeners upon arrival. Observable over own implementation of events.
 * @param wsURL
 * @constructor
 */
function TweetStream (wsURL, handlers) {
    this.ws = new WebSocket(wsURL);

    this.listeners = [];

    this.ws.onmessage = function (event) {
        var parsed = JSON.parse(event.data);
        this.listeners.forEach(function(listen) {
            listen(parsed);
        });
    }.bind(this);

    this.ws.onerror = handlers.onerror || function(){};
}

//TODO: mixin
TweetStream.prototype.addListener = function addListener(cb) {
    this.listeners.push(cb);
};

/**
 * Sends a message through connected web socket
 * @param message Message identifier to be sent
 * @param value Value to be sent alongside message
 */
TweetStream.prototype.send = function(message, value) {
    //TODO: is value even used on server?
    this.ws.send(message, value);
};

module.exports = TweetStream;