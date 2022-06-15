const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const res = require('express/lib/response')

async function create (first_name, last_name, email, phone_number, password) {
    try {
        const details = {first_name, last_name, email, phone_number, password}
        const user = await User.create(details)
        return user
    } catch (error) {
        return error
    }
}

async function checkEmail (email) {
    try {
        const emailCheck = await User.findOne({
            where: { email }
        })
        return emailCheck ? true : false
    } catch (error) {
        return error
    }
}

async function checkPhoneNumber (phone_number) {
    try {
        const numberCheck = await User.findOne({
            where: { phone_number }
        })
        return numberCheck ? true : false
    } catch (error) {
        return error
    }
}

async function checkEmailAndPhoneNumber (email, phone_number) {
    try {
        const email_exists = await checkEmail(email)
        const phone_number_exists = await checkPhoneNumber(phone_number)
        if (email_exists && phone_number_exists) return true
        else return false

    } catch (error) {
        return error
    }
}

async function checkIfEnteredPasswordsMatches (password, confirm_password) {
    try {
        return password === confirm_password 
    } catch (error) {
        return error
    }
}

async function hashEnteredPassword(password) {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);   
        return hash  
    } catch (error) {
        return(error)
    }
}

async function getDetailsByEmail (email) {
    try {
        const selected = await User.findOne({
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'createdAt', 'updatedAt'],
            where: {
                email
              }
        });
        return selected
    } catch (error) {
        return error
    }
}


// async function getDetailsByEmail2 (id) {
//     try {
//         const selected = await User.findAll({
//             attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'createdAt', 'updatedAt'],
//             where: { id }
//         });

//         if (selected == 1) return true
//         else return false
    
//     } catch (error) {
//         return error
//     }
// }

// getDetailsById(18)
    // .then(result => console.log(result[0]))

async function collectEmailHashedPassword (email) {
    try {
        const hashedPassword = await User.findAll({
            attributes: ['password'],
            where: { email }
        })
        return hashedPassword
    } catch (error) {
        return error
    }
}

async function checkIfEnteredPasswordEqualsHashed(password, hashedPassword) {
    try {
        const result = await bcrypt.compare(password, hashedPassword)
        return (result)
    } catch (error) {
        return error 
    }
}

async function updateAccountDetails (id, first_name, last_name, email, phone_number) {
    try {
        const updated = await User.update({first_name, last_name, email, phone_number}, {
            where: {
                id
            }
        })
        return updated
    } catch (error) {
        return error 
    }
}

// updateAccountDetails(18, 'Adedolapo', 'Emmauel', 'adedolly@gmail.com', '09066318532')
//     .then(result => console.log(result))

const functions = {
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
}

module.exports  = functions