'use strict';
var Alexa = require('alexa-sdk');
var handlers = require('./handlers.js');
var languageStrings = require('./translations');
// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers.defaultState, handlers.messageState);
    alexa.execute();
};



