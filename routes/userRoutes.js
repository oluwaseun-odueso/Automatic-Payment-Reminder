const express = require('express')
const User = require('../models/userModel')
const {generateToken} = require('../config/auth')
const {
    create, 
    checkEmail, 
    checkPhoneNumber, 
    checkIfEnteredPasswordsMatches, 
    hashEnteredPassword, 
    selectAttributesByEmail,
    collectEmailHashedPassword,
    checkIfEnteredPasswordEqualsHashed
} = require('../controllers/userRoutesFunctions')

const router = express.Router()

router.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        const {email, password} = req.body
        try {
            const emailCheck = await checkEmail(email)
            if (emailCheck === 1) {
                const hashedPassword = await collectEmailHashedPassword(email)
                const checkPassword = await checkIfEnteredPasswordEqualsHashed(password, hashedPassword[0].password)
                console.log(checkPassword)
                if (checkPassword === true) {
                    const userDetails = await selectAttributesByEmail(email)
                    const user = JSON.parse(JSON.stringify(userDetails[0]))

                    const token = await generateToken(user)

                    res.status(200).send({
                        message : "You have successfully logged in.", 
                        user, 
                        token
                    })
                }
                else{
                    res.status(400).send({message: "You have entered an incorrect password"})
                }
            }
            else{
                res.status(400).send({message: "Email does not exist"})
            }
        } catch (error) {
            res.send({message : error.message})
        }
    }
    else {
        res.status(400).json({
            errno: "101",
            message: "Please enter all fields"
        })
    }
})

router.post('/signUp', async(req, res) => {
    if (req.body.first_name && req.body.last_name && req.body.email && req.body.phone_number && req.body.password && req.body.confirm_password) {
        const {first_name, last_name, email, phone_number, password, confirm_password} = req.body
        try {
            const emailCheck = await checkEmail(email)
            if (emailCheck != 1) {
                const checkNumber = await checkPhoneNumber(phone_number)
                if (checkNumber != 1) {
                    const checkPasswords = await checkIfEnteredPasswordsMatches(password, confirm_password)
                    if (checkPasswords === true) {
                        const hashedPassword = await hashEnteredPassword(password)
                        await create(first_name, last_name, email, phone_number, hashedPassword)
                        const user = await selectAttributesByEmail(email)
                        res.status(201).send({
                            message : "New user added", 
                            user
                        })
                    }
                    else {
                        res.status(400).send({message: "Password and confirm password do not match."})
                    }
                }
                else {
                    res.status(400).send({message: "Phone number already registered, kindly use another."})
                }
            }
            else {
                res.status(400).send({message: "Email already registered, kindly use another."})
            }
        } catch (error) {
            res.send({message : error.message})
        }
    }
    else {
        res.status(400).json({
            errno: "101",
            message: "Please enter all fields"
        })
    }
})


router.get('/get_all_users', async (req, res) => {
    const users = await User.findAll()
    res.status(200).send(users) 
})

router.patch('/update/:id', async (req, res) => {
    console.log(req.body)
    const {first_name, last_name, email, phone_number, password, createdAt, updatedAt} = req.body
    const updatedUser = await User.update({first_name, last_name, email, phone_number, password, createdAt, updatedAt}, {
        where: {
            id: req.params.id
        }
    })
    res.status(201).send(updatedUser)
})

module.exports = router