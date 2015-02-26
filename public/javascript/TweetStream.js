
function TweetStream (wsURL) {
    this.ws = new WebSocket(wsURL);

    this.listeners = [];

    this.ws.onmessage = function (event) {
        var parsed = JSON.parse(event.data);
        this.listeners.forEach(function(listen) {
            listen(parsed);
        });
    }.bind(this);
}

TweetStream.prototype.addListener = function addListener(cb) {
    this.listeners.push(cb);
};

TweetStream.prototype.send = function(message, value) {
    this.ws.send(message, value);
};

module.exports = TweetStream;