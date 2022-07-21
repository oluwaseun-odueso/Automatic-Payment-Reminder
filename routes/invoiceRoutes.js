const express = require('express')
require('dotenv').config();
const { verifyToken } = require('../config/auth')
const SendEmail = require('../utils/emailConfig')
const Payment = require('../utils/paystackPayment')
const startEndReminderCronJob = require('../utils/reminder')
const sendSms = require('../utils/sendSms')
const {
    createInvoice, 
    getAllInvoices,
    getInvoiceById,
    deleteAnInvoice,
    updateReferenceNumber,
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
        const data = JSON.stringify({"amount": (invoice.total * 100), "email": invoice.email})
        const response = await Payment.initializeTransaction(data)
        
        await SendEmail.sendInvoice(invoice, response.authorization_url)
        await sendSms(invoice.phone_number, 'Dear customer, a mail has been sent to your email address containing your invoice details and a payment link to make your payment. Thanks you for your patronage.')
        await updateReferenceNumber(req.params.id, req.user.id, response.reference)

        // Start invoice reminder cron job
        await startEndReminderCronJob(invoice, response.authorization_url, response.reference)
    
        res.status(200).send({ message: "Mail has been sent to client" })

    } catch (error) { 
        console.log(error.message)
        if (error.message) {
            res.status(500).send({message: 'Error initializing transaction, please try again'})
            return
        }
        res.status(500).send(error) 
    }
})

module.exports = router