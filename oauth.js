"use strict";

var crypto = require('crypto');

/**
 * Module for providing easier methods for generating information needed for making OAuth 1.0 requests.
 * @module
 */

/**
 * Returns an OAuth key given the consumer secret and access secrets
 * @param consumerSecret
 * @param accessSecret
 * @returns {string} OAuth key
 */
function getOAuthKey(consumerSecret, accessSecret) {
    return consumerSecret + '&' + accessSecret;
}

/**
 * Returns the text for an OAuth auth request
 * @param method HTTP request: usually one of [GET, POST, PUT, DELETE]
 * @param url URL that OAuth request is targeting
 * @param consumerKey
 * @param accessToken
 * @param timestamp
 * @param nonce
 * @returns {string} Formatted OAuth request text based off information provided
 */
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

/**
 * Returns the current time (of calling) in seconds
 * @returns {number}
 */
function simpleTimestamp() {
    return Math.floor((new Date().getTime()) / 1000);
}

/**
 * Returns a simple nonce value, not guaranteed to be any good of a nonce
 * @returns {*}
 */
function simpleNonce() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Returns the OAuth signature for the provided text using provided key
 * @param key
 * @param text
 * @returns {string} URI-encoded base64 string of an HMAC-SHA1 encrypted string based off key and text
 */
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
