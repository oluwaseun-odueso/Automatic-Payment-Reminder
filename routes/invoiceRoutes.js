const express = require('express')
const {
    createInvoice, 
    getAllInvoices,
    getInvoiceById,
    deleteAnInvoice,
    updateInvoiceDetails
} = require('../controllers/invoiceRoutesFunctions')
const {verifyToken} = require('../config/auth')

const router = express.Router()

router.post('/create_invoice', verifyToken, async (req, res) => {
    if (req.body.client_id && req.body.client_name && req.body.email && req.body.phone_number && req.body.item && req.body.quantity && req.body.unit_price && req.body.total) {
        const {client_id, client_name, email, phone_number, item, quantity, unit_price, total} = req.body
        try {
            const invoice = await createInvoice(req.user.id, client_id, client_name, email, phone_number, item, quantity, unit_price, total)
            res.status(201).send({
                message : "New invoice created", 
                invoice
            })
        } catch (error) { res.send({message : error.message}) }
    } else res.status(400).send({ errno: "101", message: "Please enter all required fields correctly." })
})

router.get('/get_all_invoices', verifyToken, async (req, res) => {
    try {
        const clients = await getAllInvoices(req.user.id)
        res.status(200).send(clients)
    } catch (error) { res.send({message : error.message}) }
})

router.get('/get_invoice/:id', verifyToken, async (req, res) => {
    try {
        const invoice = await getInvoiceById(req.params.id, req.user.id)
        if ( ! invoice) {
            res.status(400).send({ message: "Invoice does not exist" })
            return
        }
        res.status(200).send(invoice)
    } catch (error) { res.send({message : error.message}) }
})

router.patch('/update_invoice_details/:id', verifyToken, async (req, res) => {
    if (req.body.client_id, req.body.client_name && req.body.email && req.body.phone_number && req.body.item && req.body.quantity && req.body.unit_price && req.body.total) {
        const {client_id, client_name, email, phone_number, item, quantity, unit_price, total} = req.body
        try {
            const checkIfInvoiceExists = await getInvoiceById(req.params.id, req.user.id)
            if ( ! checkIfInvoiceExists) {
                res.status(400).send({ message: "Invoice does not exist" })
                return
            }
            await updateInvoiceDetails(req.user.id, req.params.id, client_id, client_name, email, phone_number, item, quantity, unit_price, total)
            const invoice = await getInvoiceById(req.params.id, req.user.id)
            res.status(201).send({
                message: "Invoice updated",
                invoice
            })
         } catch (error) { res.send({message : error.message}) }
    }
    else res.status(400).send({ errno: "101", message: "Please enter all fields" })
})

router.delete('/delete_invoice/:id', verifyToken, async (req, res) => {
    try {
        const result = await deleteAnInvoice(req.params.id, req.user.id)
        if ( result) {
            res.status(200).send({message: "Invoice has been deleted."})
            return
        }
        res.status(400).send({message: "Invoice does not exist"})
    } catch (error) { res.send({message : error.message}) }
})

module.exports = router