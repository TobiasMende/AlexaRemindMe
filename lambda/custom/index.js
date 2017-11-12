'use strict';
var Alexa = require("alexa-sdk");
var aws = require('aws-sdk');
var ses = new aws.SES({
   region: 'us-east-1'
});

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers, locationHandlers, messageHandlers);
    alexa.execute();
};

const languageStrings = {
    'de' : {
        translation : {
            WHERE_TO_SEND : 'Wohin möchtest Du senden?',
            WHAT_TO_SEND : 'Was möchtest Du an %s senden?',
            COMMIT_MESSAGE: 'Okay, Ich habe "%s" an "%s" gesendet',
            BYE : 'Auf Wiedersehen!',
        }
    },
    'en' : {
        translation : {
            WHERE_TO_SEND: 'Where to send the message to?',
            WHAT_TO_SEND : 'What do you want to send to %s?',
            COMMIT_MESSAGE: 'Okay, I have send "%s" to "%s"',
            BYE : 'Good Bye!',
        },
    },
};

const states = {
    START: '_START',
    LOCATION: '_LOC',
    MESSAGE: '_MSG',
}

let destination;

const locationHandlers = Alexa.CreateStateHandler(states.LOCATION, {
    'SendMailToIntent': function () {
        destination = this.event.request.intent.slots.destination.value;
        console.log("Destination is " + destination)
        this.handler.state = states.MESSAGE;
        const question = this.t('WHAT_TO_SEND', destination);
        this.emit(':ask', question)
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, send mail' or 'alexa, send mail to work'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak(this.t('BYE'));
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that.");
        this.emit('AMAZON.HelpIntent')
    }
});

const messageHandlers = Alexa.CreateStateHandler(states.MESSAGE, {
    'MessageIntent': function () {
        const message = this.event.request.intent.slots.message.value;
        this.handler.state = states.START;
        sendMessage(destination, message, (function(err) {
            if(err) {
                console.log(err)
                this.emit(':responseReady');
            }
            else {
                const answer = this.t('COMMIT_MESSAGE', message, destination)
                this.emit(':tell', answer)
            }
        }).bind(this));
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, send mail' or 'alexa, send mail to work'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak(this.t('BYE'));
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.emit('MessageIntent')
    }
});

function sendMessage(destination, message, callback) {
    var eParams = {
        Destination: {
            ToAddresses: ["lordmobi@gmail.com"]
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: message
            }
        },
        Source: "mobishab@gmail.com"
    };

    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(!err) {
            console.log("===EMAIL SENT===");
        }
        callback(err)
    });
}

const handlers = {
    'LaunchRequest': function () {
        this.handler.state = states.LOCATION;
        this.emit(':ask', this.t('WHERE_TO_SEND'));
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, send mail' or 'alexa, send mail to work'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak(this.t('BYE'));
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that.");
        this.emit('AMAZON.HelpIntent')
    }
};
