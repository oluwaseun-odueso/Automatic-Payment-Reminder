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

async function checkEmail (email) {
    try {
        const emailCheck = await User.findAll({
            where: { email }
        })
        return emailCheck.length
    } catch (error) {
        return error
    }
}

async function checkPhoneNumber (phone_number) {
    try {
        const numberCheck = await User.findAll({
            where: { phone_number }
        })
        return numberCheck.length
    } catch (error) {
        return error
    }
}


async function checkIfEnteredPasswordsMatches (password, confirm_password) {
    try {
        if (password === confirm_password){
            return true
        } 
        else {
            return false
        }
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

async function selectAttributesByEmail (email) {
    try {
        const selected = await User.findAll({
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

// collectEmailHashedPassword('tinubabs@gmail.com')
//     .then(result => console.log(result[0].password))

const functions = {
    create, 
    checkEmail,
    checkPhoneNumber, 
    checkIfEnteredPasswordsMatches, 
    hashEnteredPassword, 
    selectAttributesByEmail,
    collectEmailHashedPassword, 
    checkIfEnteredPasswordEqualsHashed
}

module.exports  = functions