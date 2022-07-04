const express = require('express')
const {generateToken, verifyToken} = require('../config/auth')
const {
    createUser, 
    checkEmail,
    getAUser,
    getAllUsers, 
    deleteAUser,
    checkPhoneNumber, 
    checkIfEntriesMatch,
    checkIfEnteredPasswordsMatches, 
    hashEnteredPassword, 
    getDetailsByEmail,
    getDetailsById,
    collectEmailHashedPassword,
    checkIfEnteredPasswordEqualsHashed,
    updateAccountDetails, 
    checkEmailAndPhoneNumber
} = require('../controllers/userRoutesFunctions')

const router = express.Router()

router.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        const {email, password} = req.body
        try {
            if ( ! await checkEmail (email) ) {
                res.status(400).send({message: "Email does not exist"})
                return
            }
            const hashedPassword = await collectEmailHashedPassword(email)
            if (await checkIfEnteredPasswordEqualsHashed(password, hashedPassword.password) !== true) {
                res.status(400).send({message: "You have entered an incorrect password"})
                return
            }
            const userDetails = await getDetailsByEmail(email)
            const user = JSON.parse(JSON.stringify(userDetails))

            const token = await generateToken(user)

            res.status(200).send({
                message : "You have successfully logged in", 
                user, 
                token
            })
            
        } catch (error) { res.send({message : error.message}) }
    }
    else res.status(400).json({ errno: "101", message: "Please enter all fields" })
})

router.post('/signUp', async(req, res) => {
    if (req.body.first_name && req.body.last_name && req.body.business_name && req.body.payment_link && req.body.email && req.body.phone_number && req.body.password && req.body.confirm_password) {
        const {first_name, last_name, business_name, payment_link, email, phone_number, password, confirm_password} = req.body
        try {
            if ( await checkEmailAndPhoneNumber (email, phone_number) ) {
                res.status(400).send({ message : "Email and phone number already exists"}) 
                return
            }
            if ( await checkEmail(email) ) {
                res.status(400).send({ message : "Email already exists"}) 
                return
            }
            if ( await checkPhoneNumber(phone_number) ) {
                res.status(400).send({ message : "Phone number already exists"})
                return
            }
            if ( ! checkIfEnteredPasswordsMatches (password, confirm_password)) {
                res.status(400).send({ message : "Passwords do not match."})
                return
            }

            const hashedPassword = await hashEnteredPassword(password)
            await createUser(first_name, last_name, business_name, payment_link, email, phone_number, hashedPassword)
            const user = await getDetailsByEmail(email)
            res.status(201).send({
                message : "New user added", 
                user
            })

        } catch (error) { res.send({message : error.message}) }
    } else res.status(400).send({ errno: "101", message: "Please enter all fields" })
})


router.patch('/update_account_details', verifyToken, async(req, res) => {
    if (req.body.first_name && req.body.last_name && req.body.business_name && req.body.payment_link && req.body.email && req.body.phone_number) {
        const { first_name, last_name, business_name, payment_link, email, phone_number} = req.body
        const user = await getDetailsById(req.user.id)
        try {
            // If email exists in database and email is not user's existing email
            if ( await checkEmail (email) && ! checkIfEntriesMatch(user.email, email)) {
                res.status(400).send("Email already exists")
                return
            }

            // If phone_number exists in database and phone_number is not user's existing phone_number
            if ( await checkPhoneNumber (phone_number) && ! checkIfEntriesMatch(user.phone_number, phone_number)) {
                res.status(400).send("Phone number already exists")
                return
            }
            await updateAccountDetails(req.user.id, first_name, last_name, business_name, payment_link, email, phone_number)
            const updated = await getDetailsById(req.user.id)
            res.status(200).send({message: 'Account details updated', updated})
        } catch (error) { res.send({message : error.message}) }
    }
    else res.status(400).send({ errno: "101", message: "Please enter all fields" })
})

router.delete('/delete_account/:id', async (req, res) => {
    try {
        const result = await deleteAUser(req.params.id)
        if (result === 1) {
            res.status(200).send({message: "User has been deleted."})
            return
        }
        res.status(400).send({message: "User does not exist"})
    } catch (error) { res.send({message : error.message}) }
})

router.get('/get_a_user', verifyToken, async (req, res) => {
    try {
        const user = await getAUser(req.user.id)
        if (! user) {
            res.status(400).send({message: "User does not exist"})
            return
        }
        res.status(200).send(user)
    } catch (error) { res.send({message : error.message}) }
})

router.get('/get_all_users', async (req, res) => {
    try {
        const users = await getAllUsers()
        res.status(200).send(users)
    } catch (error) { res.send({message : error.message}) } 
})

module.exports = router