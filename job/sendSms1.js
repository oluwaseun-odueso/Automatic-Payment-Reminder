require('dotenv').config();
var messagebird = require('messagebird')(process.env.MESSAGEBIRD_LIVE_KEY);

async function sendSms() {
    var params = {
        originator : '09066318539',
        recipients : [ '+2349066318539' ],
        body : 'Hi! Message from Seun using messagebird.'
    }
    
    await messagebird.messages.create(params, (err, response) => {
        if (err) {
        console.log("ERROR:");
        console.log(err);
        } else {
        console.log("SUCCESS:");
        console.log(response);
        }
    });
}

// var messagebird = require('messagebird')(process.env.MESSAGEBIRD_LIVE_KEY);

//     var params = {
//       'originator': 'TestMessage',
//       'recipients': [
//         '+2349066318539'
//     ],
//       'body': 'Hi! Message from Seun using messagebird.'
//     };

//     messagebird.messages.create(params, function (err, response) {
//       if (err) {
//         return console.log(err);
//       }
//       console.log(response);
//     });


sendSms()