const express = require('express')
const User = require('../models/userModel')
const {generateToken, verifyToken} = require('../config/auth')
const {
    create, 
    checkEmail, 
    checkPhoneNumber, 
    checkIfEnteredPasswordsMatches, 
    hashEnteredPassword, 
    getDetailsByEmail,
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
            if (await checkIfEnteredPasswordEqualsHashed(password, hashedPassword[0].password) !== true) {
                res.status(400).send({message: "You have entered an incorrect password"})
                return
            }
            const userDetails = await getDetailsByEmail(email)
            const user = JSON.parse(JSON.stringify(userDetails))

            const token = await generateToken(user)

            res.status(200).send({
                message : "You have successfully logged in.", 
                user, 
                token
            })
            // const emailCheck = await checkEmail(email)
            // if (emailCheck === 1) {
            //     const hashedPassword = await collectEmailHashedPassword(email)
            //     const checkPassword = await checkIfEnteredPasswordEqualsHashed(password, hashedPassword[0].password)
            //     console.log(checkPassword)
            //     if (checkPassword === true) {
                    // const userDetails = await getDetailsByEmail(email)
                    // const user = JSON.parse(JSON.stringify(userDetails[0]))

                    // const token = await generateToken(user)

                    // res.status(200).send({
                    //     message : "You have successfully logged in.", 
                    //     user, 
                    //     token
                    // })
            //     }
            //     else{
            //         res.status(400).send({message: "You have entered an incorrect password"})
            //     }
            // }
            // else{
            //     res.status(400).send({message: "Email does not exist"})
            // }

            
        } catch (error) { res.send({message : error.message}) }
    }
    else res.status(400).json({ errno: "101", message: "Please enter all fields" })
})

router.post('/signUp', async(req, res) => {
    if (req.body.first_name && req.body.last_name && req.body.email && req.body.phone_number && req.body.password && req.body.confirm_password) {
        const {first_name, last_name, email, phone_number, password, confirm_password} = req.body
        try {
            if ( await checkEmailAndPhoneNumber (email, phone_number)) {
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
            if ( ! await checkIfEnteredPasswordsMatches (password, confirm_password)) {
                res.status(400).send({ message : "Passwords do not match."})
                return
            }
            const hashedPassword = await hashEnteredPassword(password)
            await create(first_name, last_name, email, phone_number, hashedPassword)
            const user = await getDetailsByEmail(email)
            res.status(201).send({
                message : "New user added", 
                user
            })
            // try {
            //     const emailCheck = await checkEmail(email)
            //     if (emailCheck != 1) {
            //         const checkNumber = await checkPhoneNumber(phone_number)
            //         if (checkNumber != 1) {
            //             const checkPasswords = await checkIfEnteredPasswordsMatches(password, confirm_password)
            //             if (checkPasswords === true) {
            //                 const hashedPassword = await hashEnteredPassword(password)
            //                 await create(first_name, last_name, email, phone_number, hashedPassword)
                            // const user = await getDetailsByEmail(email)
                            // res.status(201).send({
                            //     message : "New user added", 
                            //     user
                            // })
            //             }
            //             else {
            //                 res.status(400).send({message: "Password and confirm password do not match."})
            //             }
            //         }
            //         else {
            //             res.status(400).send({message: "Phone number already registered, kindly use another."})
            //         }
            //     }
            //     else {
            //         res.status(400).send({message: "Email already registered, kindly use another."})
            //     }
            // } catch (error) {
            //     res.send({message : error.message})
            // }
        } catch (error) { res.send({message : error.message}) }
    } else res.status(400).send({ errno: "101", message: "Please enter all fields" })
})

router.patch('/update_account_details', verifyToken, async(req, res) => {
    if (req.body.first_name && req.body.last_name && req.body.email && req.body.phone_number) {
        const {first_name, last_name, email, phone_number} = req.body
        try {
            // const user = await getDetailsByEmail(req.user.email)
            console.log(req.user.email)
            const user = JSON.parse(JSON.stringify( (await getDetailsByEmail(req.user.email)) ))
            if ( email !== user.email) {
                if ( await checkEmail(email) ) {
                    res.status(400).send({ message : "Email already exists"}) 
                    return
                }
            }
            if ( phone_number !== user.phone_number) {
                if ( await checkPhoneNumber(phone_number) ) {
                    res.status(400).send({ message : "Phone number already exists"})
                    return
                }
            }
            await updateAccountDetails(req.user.id, first_name, last_name, email, phone_number)
            const updatedDetails = await getDetailsByEmail(email)
            res.status(201).send({
                message : "Account details updated", 
                updatedDetails
            })
            
        } catch (error) { res.send({message : error.message}) }
    } else res.status(400).send({ errno: "102", message: "Please enter all fields" })
})


// // router.get('/get_all_users', async (req, res) => {
// //     const users = await User.findAll()
// //     res.status(200).send(users) 
// // })

// router.patch('/update/:id', async (req, res) => {
//     console.log(req.body)
    // const {first_name, last_name, email, phone_number, password, createdAt, updatedAt} = req.body
//     const updatedUser = await User.update({first_name, last_name, email, phone_number}, {
//         where: {
//             id: req.params.id
//         }
//     })
//     res.status(201).send(updatedUser)
// })

module.exports = router