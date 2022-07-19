const express = require('express')
const connection = require('./config/databaseConnection')
const userRoute = require('./routes/userRoutes')
const clientRoute = require('./routes/clientRoutes')
const invoiceRoute = require('./routes/invoiceRoutes')
const axios = require('axios');
require('dotenv').config()
const port = 4000

const app = express()
app.use(express.json())

connection

app.use('/user', userRoute)
app.use('/client', clientRoute)
app.use('/invoice', invoiceRoute)

app.get('/', (req, res) => {
    res.status(200).send("Welcome to the official page")
})

app.get('/get_json_ph_data', async(req, res)=>{
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
    console.log(response.data)
    res.send(response.data)
})

app.post('/axios/post', async (req, res) => {
    const data = {
        userId: 10,
        title: "New post",
        body: "this is a new post"
    }
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts',data)
    res.send(response.data)
})

app.get('/verify_payment', async (req, res) => {
    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${req.body.reference}`,{
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": 'Bearer ' + process.env.PAYSTACK_TOKEN
            },
        })
        console.log(response.data.data.status)
        res.send(response.data.data)
    } catch (error) {
        res.send(error)
    }
})

app.post('/initialize_transaction', async (req, res) => {
    try {
        const data = '{ "amount": "50000" , "email": "seunoduez@gmail.com"}'
        const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": 'Bearer ' + process.env.PAYSTACK_TOKEN
            }
        }, { timeout: 2000})
        res.status(200).send(response.data)
    } catch (error) {
        if (error.message === 'getaddrinfo ENOTFOUND api.paystack.co') {
            res.status(500).send({message: "Check your network connection and try again"})
        }
    }
})

// app.post('/send_otp', (req, res) => {
//     try {
//         const data = {
//             'mobile': '2349066318539',
//             'sender_id': 'SMSINFO',
//             'message': 'Your otp code is {code}',
//             'expiry': '900'
//           }
//         const response = await axios.post('https://d7networks.com/api/verifier/send', data, {
//             headers: {
//                 'Authorization': 'Token {D7 verify token}'
//             }
//         })
//         console.log(response)
//         res.status(201).send(response)
//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// })

app.listen(port)

module.exports = app