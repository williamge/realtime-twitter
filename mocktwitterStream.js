"use strict";

var events = require('events');

function mocktwitterStream() {
    var self = this;

    var interval = setInterval((function() {
        self.emit('tweet', JSON.stringify(new Date()));
    }).bind(self), 1000);

}



mocktwitterStream.prototype = Object.create(events.EventEmitter.prototype);
mocktwitterStream.prototype.constructor = mocktwitterStream;

module.exports = mocktwitterStream;
