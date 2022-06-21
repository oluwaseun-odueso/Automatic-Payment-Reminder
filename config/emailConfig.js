const nodemailer = require('nodemailer');
require('dotenv').config();

class SendEmail {
    constructor () {
        this._transporter = nodemailer.createTransport({
            service : "gmail",
            auth: {
                user: "seunoduez@gmail.com",
                pass: process.env.EMAIL_PASSWORD
            }  
        });
    }

    async sendReminder (invoice, link) {
        try {
            const options = {
                from: "seunoduez@gmail.com",
                to: invoice.email,
                subject: "Alert for overdue payment.",
                text: `Dear esteemed client, this is a 
                reminder of the payment of your 
                previous purchase for
                item: ${invoice.item},
                invoice id: ${invoice.id},
                quantity: ${invoice.quantity},
                unit price: ${invoice.unit_price},
                total price: ${invoice.total},
                from us is now overdue, 
                find the link to pay below, thank you for your patronage.

                link: ${link}`  
            };
    
            this._transporter.sendMail(options, function(err, info) {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log("Email sent: " + info.response);
            })
        } catch (error) { return error }
    }

    async sendInvoice (invoice, link) {
        try {
            const options = {
                from: "seunoduez@gmail.com",
                to: invoice.email,
                subject: "Invoice alert",
                text: `Dear esteemed client, this is an 
                invoice of your previous purchase for
                item: ${invoice.item},
                invoice id: ${invoice.id},
                quantity: ${invoice.quantity},
                unit price: ${invoice.unit_price},
                total price: ${invoice.total},
                from us, find the link to pay below, thank you for your patronage .
                
                link: ${link}`  
            }; 
            this._transporter.sendMail(options, function(err, info) {
                if(err) {
                    console.log(err);
                    return;
                } 
                console.log("Email sent: " + info.response);
            })
        } catch (error) { return error }
    }
}

module.exports = new SendEmail
