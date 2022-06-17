const User = require('../models/userModel')
const bcrypt = require('bcrypt')

async function create (first_name, last_name, email, phone_number, password) {
    try {
        const details = {first_name, last_name, email, phone_number, password}
        const user = await User.create(details)
        return user
    } catch (error) {
        return error
    }
}

async function getAllUsers () {
    try {
        const allUsers = await User.findAll()
        return allUsers
    } catch (error) {
        return error
    }
}

async function getAUser (id) {
    try {
        const user = await User.findOne({
            attributes: { exclude: ['password'] },
            where: { id }
        })
        return user
    } catch (error) {
        return error
    }
}

async function deleteAUser (id) {
    try {
        const response = await User.destroy({
            where: { id } })
        return response
    } catch (error) {
        return error
    }
}

// deleteAUser(8)
//     .then(res => console.log(res))

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
function checkIfEntriesMatch (initialValue, newValue) {
    return initialValue === newValue
}

function checkIfEnteredPasswordsMatches (password, confirm_password) {
    return password === confirm_password 
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
            attributes: { exclude: ['password'] },
            where: { email }
        });
        return selected
    } catch (error) {
        return error
    }
}

async function getDetailsById (id) {
    try {
        const selected = await User.findOne({
            attributes: { exclude: ['password'] },
            where: { id }
        });
        return selected
    } catch (error) {
        return error
    }
}

// getDetailsByEmail("topeolaiya@gmail.com")
//     .then(result => console.log(result))

async function collectEmailHashedPassword (email) {
    try {
        const hashedPassword = await User.findOne({
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
        const response = await User.update({first_name, last_name, email, phone_number}, {
            where: { id }
        })
        return response
    } catch (error) {
        return error 
    }
}

// updateAccountDetails(20, 'Oluwaseun', 'Janet', 'seunjane@gmail.com', '09073347721')
//     .then(result => console.log(result))

const functions = {
    create, 
    checkEmail,
    getAUser,
    getAllUsers,
    deleteAUser,
    checkPhoneNumber, 
    checkIfEnteredPasswordsMatches, 
    hashEnteredPassword, 
    getDetailsByEmail,
    collectEmailHashedPassword, 
    checkIfEnteredPasswordEqualsHashed,
    updateAccountDetails,
    checkEmailAndPhoneNumber, 
    getDetailsById,
    checkIfEntriesMatch
}

module.exports  = functions