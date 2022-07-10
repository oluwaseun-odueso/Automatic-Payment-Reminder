const express = require('express')
const connection = require('./config/databaseConnection')
const userRoute = require('./routes/userRoutes')
const clientRoute = require('./routes/clientRoutes')
const invoiceRoute = require('./routes/invoiceRoutes')
const invoice_reminder = require('./job/reminder')
const axios = require('axios');
require('dotenv').config()
const port = 4000

const app = express()
app.use(express.json())

connection

const router = express.Router()
router.get('/login', (req, res) => {
    res.status(200).send('<h1>Hello Express!</h1>')
})
// localhost:4000/test/login
app.use("/test", router)

// app.get('/test/login', (req, res) => {
//     // res.status(200).send({message: 'Message sent'})
//     res.status(200).send('<h1>Hello Express!</h1>')
// })

app.get('/test/signup', (req, res) => {
    res.status(201).send({message: 'Message sent'})
})

app.get('/test/update', (req, res) => {
    // res.status(200).send({message: 'Message sent'})
    res.status(400).send('<h1>Hello Express!</h1>')
})

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

app.post('/axios/post', async(req, res)=>{
    const data = {
        userId: 10,
        title: "NEw post",
        body: "this is a new post"
    }
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts',data)
    res.send(response.data)
})

app.get('/verify_payment', async(req, res)=>{
    try {
        // const response = await axios.get(`https://api.paystack.co/transaction/verify/${req.body.reference}`,{
        const response = await axios.get(`localhost:4000`,{
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": 'Bearer ' + ''
            }
        })
        res.send(response)
    } catch (error) {
        res.send(error)
    }
    
})
app.listen(port)

module.exports = app