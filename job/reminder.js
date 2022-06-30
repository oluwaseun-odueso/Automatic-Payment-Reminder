const cron = require('node-cron');
const SendEmail = require('../config/emailConfig')
const {checkIfInvoiceIsPaid} = require('../controllers/invoiceRoutesFunctions')


async function startEndReminderCronJob (invoice, payment_link, user_id) {
  const reminder_invoice_job = cron.schedule('*/20 * * * * *', async () => {
    if (await checkIfInvoiceIsPaid(invoice.id, user_id)) {
      endReminderCronJob(reminder_invoice_job)
    }
    else {
      await SendEmail.sendReminder(invoice, payment_link)
      console.log(`Email sent to ${invoice.email}`)
    }  
  });
}

function endReminderCronJob (job) {
  job.stop()
  console.log('Job ended')
}

module.exports = startEndReminderCronJob
