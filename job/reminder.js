const cron = require('node-cron');
const SendEmail = require('../config/emailConfig')
const {getInvoiceById} = require('../controllers/invoiceRoutesFunctions')


function startEndReminderCronJob (invoice, payment_link) {
  // Check if invoice has been paid
  const reminder_invoice_job = cron.schedule('*/20 * * * * *', async () => {
    await SendEmail.sendReminder(invoice, payment_link)
    console.log('Running a task every 20 seconds')  
  }, {
    scheduled: false
  });
  reminder_invoice_job.start()
  endReminderCronJob(reminder_invoice_job)
}

function endReminderCronJob (job) {
  job.stop()
}

module.exports = startEndReminderCronJob
