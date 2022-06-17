const Client = require('../models/clientModel')

async function createClient (name, email, phone_number) {
    try {
        const details = {name, email, phone_number}
        const user = await Client.create(details)
        return user
    } catch (error) {
        return error
    }
}

async function checkIfEmailExists (email) {
    try {
        const emailCheck = await Client.findOne({
            where: { email }
        })
        return emailCheck ? true : false
    } catch (error) {
        return error
    }
}

async function checkIfPhoneNumberExists (phone_number) {
    try {
        const numberCheck = await Client.findOne({
            where: { phone_number }
        })
        return numberCheck ? true : false
    } catch (error) {
        return error
    }
}

async function checkIfEmailAndPhoneNumberExists (email, phone_number) {
    try {
        const email_exists = await checkIfEmailExists(email)
        const phone_number_exists = await checkIfPhoneNumberExists(phone_number)
        if (email_exists && phone_number_exists) return true
        else return false

    } catch (error) {
        return error
    }
}


async function getClientById (id) {
    try {
        const selected = await Client.findOne({  
            where: { id }
        });
        return selected
    } catch (error) {
        return error
    }
}

async function getAllClients () {
    try {
        const allClients = await Client.findAll()
        return allClients
    } catch (error) {
        return error
    }
}

async function deleteAClient (id) {
    try {
        const response = await Client.destroy({
            where: { id } 
        })
        return response
    } catch (error) {
        return error
    }
}

function checkIfEntriesMatch (initialValue, newValue) {
    return initialValue === newValue
}

async function updateClientDetails (id, name, email, phone_number) {
    try {
        const response = await Client.update({name, email, phone_number}, {
            where: { id }
        })
        return response
    } catch (error) {
        return error 
    }
}

const functions = {
    createClient,
    checkIfEmailExists,
    checkIfPhoneNumberExists,
    checkIfEmailAndPhoneNumberExists,
    checkIfEntriesMatch,
    getClientById,
    getAllClients,
    deleteAClient,
    updateClientDetails
}

module.exports = functions