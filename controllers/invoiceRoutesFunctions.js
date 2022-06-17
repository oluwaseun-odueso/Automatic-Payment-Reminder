const { INTEGER } = require('sequelize')
const Invoice = require('../models/invoiceModel')

async function createInvoice (client_id, client_name, email, phone_number, item, quantity, unit_price, total) {
    try {
        const details = {client_id, client_name, email, phone_number, item, quantity, unit_price, total}
        const user = await Invoice.create(details)
        return user
    } catch (error) {
        return error
    }
}

// To be tested
async function getAllInvoices () {
    try {
        const allInvoices = await Invoice.findAll()
        return allInvoices
    } catch (error) {
        return error
    }
}
// getAllInvoices()
//     .then(i => console.log(i.length))

// To be tested
async function getInvoiceById (id) {
    try {
        const selected = await Invoice.findOne({  
            where: { id }
        });
        return selected
    } catch (error) {
        return error
    }
}


async function deleteAnInvoice (id) {
    try {
        const response = await Invoice.destroy({
            where: { id } 
        })
        return response
    } catch (error) {
        return error
    }
}

// createInvoice(7, "Mosunola Ademola", "mosunmi@gmail.com", "08041773890", "Cartier ladies brown bag", "2", "50,000", "100,000")
//     .then(res => console.log(res))

const functions = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    deleteAnInvoice
}

module.exports = functions