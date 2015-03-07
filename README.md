#  Realtime twitter demo

## What it is

A web app using the Twitter streaming API to showcase a stream of disconnected tweets.

## How to use it

There is a live demo on Heroku: [https://wg-twitter.herokuapp.com/](https://wg-twitter.herokuapp.com/)

Running the app locally is a relatively-contained process:

* `git clone` the repository
* run `npm install`
* Set the Twitter API keys `consumerSecret`, `accessSecret`, `consumerKey`, and `accessToken` as environment variables.
* run `npm start`
* the server will be running locally, by default serving up HTTP requests on `localhost:5000`

## How it does it

* A Node.js+Express.js backend serves the HTML parts of the app, and dynamically compiles the CSS (using Stylus as the preprocessor) and javascript (using Webpack and Babel)
* Front-end interface uses React.js and a comfortable amount of ECMAScript 6 (transpiled through Babel), connects to a websocket backend served by the Node.js+ws server (kind of strange that Node.js doesn't come with it's own websocket library)
* Node.js+ws server connects to the Twitter streaming API and parses and relays the streaming data back to the front-end

## How it does it, but quicker

* Node.js
* Express.js
* ws (websocket library)
* ReactJS
* Stylus
* Webpack
* Babel
* ECMAScript 6