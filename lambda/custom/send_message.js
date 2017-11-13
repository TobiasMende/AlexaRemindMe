var aws = require('aws-sdk');
var ses = new aws.SES({
    region: 'us-east-1'
});

module.exports = function (destination, message, callback) {
    const config = require('./config.json');
    const dest = destination.toLowerCase();
    if(dest in config.recipients) {
        const recipient = config.recipients[dest];
        var eParams = {
            Destination: {
                ToAddresses: [recipient]
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
            Source: config.sender
        };
    
        console.log('===SENDING EMAIL===');
        ses.sendEmail(eParams, function(err, data){
            if(!err) {
                console.log('===EMAIL SENT===');
            }
            callback(err);
        });
    } else {
        callback({ 'message' : 'No email address was found for ' + destination});
    }
    
};