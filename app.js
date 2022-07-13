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

// const router = express.Router()
// router.get('/login', (req, res) => {
//     res.status(200).send('<h1>Hello Express!</h1>')
// })
// // localhost:4000/test/login
// app.use("/test", router)

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
        })
        console.log(response.data.data.authorization_url)
        console.log(response.data.data.reference)
        res.status(200).send(response.data)
    } catch (error) {
        res.status(400).send(error.response.data)
    }
})

app.listen(port)

module.exports = app