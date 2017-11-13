'use strict';
var Alexa = require('alexa-sdk');
var sendMessage = require('./send_message.js');

const states = {
    START: '_START',
    MESSAGE: '_MSG',
};

let destination;
module.exports = {
    messageState: Alexa.CreateStateHandler(states.MESSAGE, {
        'MessageIntent': function () {
            const message = this.event.request.intent.slots.message.value;
            this.handler.state = states.START;
            sendMessage(destination, message, (function(err) {
                if(err) {
                    console.error(err);
                    this.emit(':tell', this.t('SEND_ERROR', err.message));
                }
                else {
                    this.emit(':tell', this.t('COMMIT_MESSAGE', message, destination));
                }
            }).bind(this));
        },
        'AMAZON.StopIntent' : stopIntent,
        'AMAZON.CancelIntent' : stopIntent,
        'Unhandled' : function() {
            this.emit(':ask', this.t('RETRY'));
        }
    }), 
    
    defaultState: {
        'LaunchRequest': function () {
            this.emit(':ask', this.t('WHERE_TO_SEND'));
        },
        'SendMailToIntent': function () {
            destination = this.event.request.intent.slots.destination.value;
            console.log('Destination is ' + destination);
            this.handler.state = states.MESSAGE;
            this.emit(':ask', this.t('WHAT_TO_SEND', destination));
        },
        'SessionEndedRequest' : function() {
            console.log('Session ended with reason: ' + this.event.request.reason);
        },
        'AMAZON.HelpIntent' : function() {
            this.response.speak('HELP_MESSAGE');
            this.emit(':responseReady');
        },
        'AMAZON.StopIntent' : stopIntent,
        'AMAZON.CancelIntent' : stopIntent,
        'Unhandled' : function() {
            console.log(this.event.request);
            this.response.speak('NOT_UNDERSTOD');
            this.emit('AMAZON.HelpIntent');
        }
    }
}

function stopIntent() {
    this.response.speak(this.t('BYE'));
    this.emit(':responseReady');
}