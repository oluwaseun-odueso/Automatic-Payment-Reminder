const express = require('express')
const {
    createClient,
    checkIfEmailExists, 
    checkIfPhoneNumberExists, 
    checkIfEntriesMatch,
    checkIfEmailAndPhoneNumberExists,
    getClientById,
    getAllClients,
    deleteAClient,
    updateClientDetails
} = require('../controllers/clientRoutesFunctions')

const router = express.Router()

router.post('/create_client', async (req, res) => {
    if (req.body.name && req.body.email && req.body.phone_number) {
        const {name, email, phone_number} = req.body
        try {
            if ( await checkIfEmailAndPhoneNumberExists(email, phone_number) ) {
                res.status(400).send({ message : "Email and phone number already exists"}) 
                return
            }
            if ( await checkIfEmailExists(email) ) {
                res.status(400).send({ message : "Email already exists"}) 
                return
            }
            if ( await checkIfPhoneNumberExists(phone_number) ) {
                res.status(400).send({ message : "Phone number already exists"})
                return
            }
            const client = await createClient(name, email, phone_number)
            res.status(201).send({
                message : "New client added", 
                client
            })
        } catch (error) { res.send({message : error.message}) }
    } else res.status(400).send({ errno: "101", message: "Please enter all required fields correctly." })
})

router.patch('/update_client_details/:id', async (req, res) => {
    if (req.body.name && req.body.email && req.body.phone_number) {
        const {name, email, phone_number} = req.body
        const client = await getClientById(req.params.id)
        try {
            // If email exists in database and email is not clients's existing email
            if ( await checkIfEmailExists(email) && ! checkIfEntriesMatch(client.email, email) ) {
                res.status(400).send({ message: "Email already exists" })
                return
            }

            // If phone_number exists in database and phone_number is not client's existing phone_number
            if ( await checkIfPhoneNumberExists (phone_number) && ! checkIfEntriesMatch(client.phone_number, phone_number)) {
                res.status(400).send({ message: "Phone number already exists" })
                return
            }
            await updateClientDetails(req.params.id, name, email, phone_number)
            const updated = await getClientById(req.params.id)
            res.status(200).send(updated)
            
         } catch (error) { res.send({message : error.message}) }
    }
    else res.status(400).send({ errno: "101", message: "Please enter all fields" })
})

router.get('/get_client/:id', async (req, res) => {
    try {
        const client = await getClientById(req.params.id)
        if ( ! client) {
            res.status(400).send({ message: "Client does not exist" })
            return
        }
        res.status(200).send(client)
    } catch (error) { res.send({message : error.message}) }
})

router.get('/get_all_clients', async (req, res) => {
    try {
        const clients = await getAllClients()
        res.status(200).send(clients)
    } catch (error) { res.send({message : error.message}) }
})

router.delete('/delete_client/:id', async (req, res) => {
    try {
        const result = await deleteAClient(req.params.id)
        if (result === 1) {
            res.status(200).send({message: "Client has been deleted."})
            return
        }
        res.status(400).send({message: "Client does not exist"})
    } catch (error) { res.send({message : error.message}) }
})

module.exports = router