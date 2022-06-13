const User = require('../models/userModel')
const express = require('express')

const router = express.Router()

router.get('/user', async (req, res) => {
    const users = await User.findAll()
    res.status(200).send(users) 
})

module.exports = router