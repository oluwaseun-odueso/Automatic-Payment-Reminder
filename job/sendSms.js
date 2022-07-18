const Vonage = require('@vonage/server-sdk')
require('dotenv').config();

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET_KEY
})

const from = "2349066318539"
const to = "2349073347721"
const text = 'Hurray! It works! A text message sent to you Oluwaseun using the Vonage SMS API'

vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log({message: "Message sent successfully."});
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})