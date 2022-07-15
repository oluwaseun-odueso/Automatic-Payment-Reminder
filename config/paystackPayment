const axios = require('axios');
require('dotenv').config();

class Payment {
    constructor () {
        this.secret_key = process.env.PAYSTACK_TOKEN
    }

    async initializeTransaction (data) {
        try {
            const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": 'Bearer ' + process.env.PAYSTACK_TOKEN
                }
            })
            return response.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async verifyPayment (reference) {
        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,{
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Autho-rization": 'Bearer ' + process.env.PAYSTACK_TOKEN
                },
            })
            // console.log(response.data)
            return response.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

module.exports = new Payment