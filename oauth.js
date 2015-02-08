"use strict";

var crypto = require('crypto');

function getOAuthKey(consumerSecret, accessSecret) {
    return consumerSecret + '&' + accessSecret;
}

function getRequestText(method, url, consumerKey, accessToken, timestamp, nonce) {

    var signatureMethod = 'HMAC-SHA1';
    var version = '1.0';

    var parameters = {
        'oauth_consumer_key': consumerKey,
        'oauth_nonce': nonce,
        'oauth_signature_method': signatureMethod,
        'oauth_timestamp': timestamp,
        'oauth_token': accessToken,
        'oauth_version': version
    };

    var parametersSorted = Object.keys(parameters);
    parametersSorted.sort();

    var parametersFormatted = parametersSorted.reduce(
        function(currentString, param) {
            return currentString + '&' + param + '=' + parameters[param];
        }, '');

    var out = method.toUpperCase() + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(parametersFormatted.substring(1));

    return out;
}

function simpleTimestamp() {
    return Math.floor((new Date().getTime()) / 1000);
}

function simpleNonce() {
    return crypto.randomBytes(16).toString('hex');
}

function getSignature(key, text) {
    return encodeURIComponent(crypto.createHmac('sha1', key).update(text).digest('base64'));
}
module.exports = {
    getOAuthKey: getOAuthKey,
    getRequestText: getRequestText,
    simpleTimestamp: simpleTimestamp,
    simpleNonce: simpleNonce,
    getSignature: getSignature
};
