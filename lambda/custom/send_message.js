var aws = require('aws-sdk');
var ses = new aws.SES({
   region: 'us-east-1'
});

module.exports = function (destination, message, callback) {
    const destinations = require('./destinations.json');
    if(destination in destinations) {
        const recipient = destinations[destination.toLowerCase()];
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
            Source: "mobishab@gmail.com"
        };
    
        console.log('===SENDING EMAIL===');
        var email = ses.sendEmail(eParams, function(err, data){
            if(!err) {
                console.log("===EMAIL SENT===");
            }
            callback(err)
        });
    } else {
        callback({ 'message' : 'No email address was found for ' + destination});
    }
    
}