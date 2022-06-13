const express = require('express')
const connection = require('./config/databaseConnection')
const userRoute = require('./routes/userRoutes')
const port = 4000

const app = express()

app.use('/user', userRoute)

app.get('/', (req, res) => {
    res.status(200).send("Welcome to the official page")
})

app.listen(port, () => console.log(`Server started on port ${port}`))