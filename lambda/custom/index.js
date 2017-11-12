'use strict';
var Alexa = require("alexa-sdk");
var handlers = require("./handlers.js");
// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers.defaultState, handlers.messageState);
    alexa.execute();
};

const languageStrings = {
    'de' : {
        translation : {
            WHERE_TO_SEND : 'Wohin möchtest Du senden?',
            WHAT_TO_SEND : 'Was möchtest Du an %s senden?',
            COMMIT_MESSAGE: 'Okay, Ich habe "%s" an "%s" gesendet',
            SEND_ERROR: 'Leider ist ein Fehler beim Senden aufgetreten: %s',
            BYE : 'Auf Wiedersehen!',
        }
    },
    'en' : {
        translation : {
            WHERE_TO_SEND: 'Where to send the message to?',
            WHAT_TO_SEND : 'What do you want to send to %s?',
            COMMIT_MESSAGE: 'Okay, I have send "%s" to "%s"',
            SEND_ERROR: 'An error occured whil sending email: %s',
            BYE : 'Good Bye!',
        },
    },
};


