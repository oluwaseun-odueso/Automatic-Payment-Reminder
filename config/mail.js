const nodemailer = require('nodemailer');
require('dotenv').config();

function mail() {
    generateForgotPasswordToken({email: "seunoduez@gmail.com"})
        .then(token => {
            const transporter = nodemailer.createTransport({
                service : "gmail",
                auth: {
                    user: "backendseun@gmail.com",
                    pass: process.env.EMAIL_PASSWORD
                }  
            });
        
            const options = {
                from: "backendseun@gmail.com",
                to: "seunoduez@gmail.com",
                subject: "Alert for overdue payment.",
                text: "Dear esteemed client, this is a reminder the payment for your previous purchase from us is now overdue, find the link to pay below ." + token
            };
        
            console.log(options)

            transporter.sendMail(options, function(err, info) {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log("Email sent: " + info.response);
            })
        })
}

mail()