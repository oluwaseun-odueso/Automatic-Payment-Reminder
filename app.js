const express = require('express')
const connection = require('./config/databaseConnection')
const userRoute = require('./routes/userRoutes')
const clientRoute = require('./routes/clientRoutes')
const invoiceRoute = require('./routes/invoiceRoutes')
const invoice_reminder = require('./job/reminder')
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

app.listen(port, () => console.log(`Server started on port ${port}`))