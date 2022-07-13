const cron = require('node-cron');
const SendEmail = require('../config/emailConfig')
const Payment = require('../config/paystackPayment')


// async function startEndReminderCronJob (invoice, payment_link, user_id) {
//   const reminder_invoice_job = cron.schedule('*/20 * * * * *', async () => {
//     if (await checkIfInvoiceIsPaid(invoice.id, user_id)) {
//       endReminderCronJob(reminder_invoice_job)
//     }
//     else {
//       await SendEmail.sendReminder(invoice, payment_link)
//       console.log(`Email sent to ${invoice.email}`)
//     }  
//   });
// }

// async function startEndReminderCronJob (data, invoice, user_id) {
//   const reminder_invoice_job = cron.schedule('*/20 * * * * *', async () => {
//     const updatedInvoice = await getInvoiceById(invoice.id, invoice.user_id)
//     if ( (await Payment.verifyPayment(updatedInvoice.reference)).status === 'success' ) {
//       endReminderCronJob(reminder_invoice_job)
//     }
//     else {
//       const response = await Payment.initializeTransaction(data)
//       await updateReferenceNumber(updatedInvoice.id, updatedInvoice.user_id, response.reference)
//       await SendEmail.sendReminder(updatedInvoice, response.authorization_url)
//     }
//   })
// }

async function startEndReminderCronJob (invoice, payment_link, reference) {
  const reminder_invoice_job = cron.schedule('*/20 * * * * *', async () => {
    const response = await Payment.verifyPayment(reference)

    if (response.status === 'success') {
      endReminderCronJob(reminder_invoice_job)
    } 
    else {
      await SendEmail.sendReminder(invoice, payment_link)
      // console.log(`Email sent to ${invoice.email}`)
    }  
  });
}

function endReminderCronJob (job) {
  job.stop()
  console.log('Job ended')
}

module.exports = startEndReminderCronJob
