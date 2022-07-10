const express = require('express')
require('dotenv').config();
const { verifyToken } = require('../config/auth')
const SendEmail = require('../config/emailConfig')
const startEndReminderCronJob = require('../job/reminder')
const {
    createInvoice, 
    getAllInvoices,
    getInvoiceById,
    deleteAnInvoice,
    updateInvoiceDetails
} = require('../controllers/invoiceRoutesFunctions')
const {getClientById} = require('../controllers/clientRoutesFunctions');

const router = express.Router()

router.post('/create_invoice', verifyToken, async (req, res) => {
    if (req.body.client_id && req.body.item && req.body.quantity && req.body.unit_price && req.body.total && req.body.payment_status) {
        const {client_id, item, quantity, unit_price, total, payment_status} = req.body
        try {
            const client = await getClientById(client_id, req.user.id)
            const invoice = await createInvoice(req.user.id, client_id, client.name, client.email, client.phone_number, item, quantity, unit_price, total, payment_status)
            res.status(201).send({
                message : "New invoice created", 
                invoice
            })
        } catch (error) { res.send({message : error.message}) }
    } else res.status(400).send({ errno: "101", message: "Please enter all fields correctly" })
})

router.get('/get_all_invoices', verifyToken, async (req, res) => {
    try {
        const invoices = await getAllInvoices(req.user.id)
        res.status(200).send({message: "All invoices", invoices})
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
    if (req.body.client_id && req.body.item && req.body.quantity && req.body.unit_price && req.body.total && req.body.payment_status) {
        const {client_id, item, quantity, unit_price, total, payment_status} = req.body
        try {
            const client = await getClientById(client_id, req.user.id)
            const checkIfInvoiceExists = await getInvoiceById(req.params.id, req.user.id)
            if ( ! checkIfInvoiceExists) {
                res.status(400).send({ message: "Invoice does not exist" })
                return
            }
            await updateInvoiceDetails(req.user.id, req.params.id, client_id, client.name, client.email, client.phone_number, item, quantity, unit_price, total, payment_status)
            const invoice = await getInvoiceById(req.params.id, req.user.id)
            res.status(200).send({
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
            res.status(200).send({message: "Invoice has been deleted"})
            return
        }
        res.status(400).send({message: "Invoice does not exist"})
    } catch (error) { res.send({message : error.message}) }
})

router.post('/send_invoice/:id', verifyToken, async (req, res) => {
    try {
        const invoice = await getInvoiceById(req.params.id, req.user.id)
        if ( ! invoice) {
            res.status(400).send({ message: "Invoice does not exist" })
            return
        }
        console.log(invoice.payment_status)
        await SendEmail.sendInvoice(invoice, req.user.payment_link)

        // Start invoice reminder cron job
        await startEndReminderCronJob(invoice, req.user.payment_link, req.user.id)


        // if (invoice.payment_status === 'unpaid') {
        // await invoice_reminder(req.user.payment_link, req.params.id, req.user.id)
        // }
    
        res.status(200).send({ message: "Mail has been sent to client" })

    } catch (error) { res.send({message : error.message}) }
})

module.exports = router