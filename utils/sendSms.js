const Vonage = require('@vonage/server-sdk')
require('dotenv').config();

async function sendSms (recipient, mssg) {
    const vonage = new Vonage({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET_KEY
    })
    
    const from = "2349066318539"
    const to = recipient
    const text = mssg
    // const text = 'Dear customer, a mail has been sent to your email address containing your invoice details and a payment link to make your payment. Thanks you for your patronage.'
    
    await vonage.message.sendSms(from, to, text, (err, responseData) => {
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
}

module.exports = sendSms
