const cron = require('node-cron');
const SendEmail = require('./emailConfig')
const Payment = require('./paystackPayment')

async function startEndReminderCronJob (invoice, payment_link, reference) {
  const reminder_invoice_job = cron.schedule('*/20 * * * * *', async () => {
    const response = await Payment.verifyPayment(reference)
    console.log('a')

    if (response.status === 'success') {
      endReminderCronJob(reminder_invoice_job)
    } 
    else {
      await SendEmail.sendReminder(invoice, payment_link)
      console.log('b')
    }  
    console.log('c')
  });
}

function endReminderCronJob (job) {
  job.stop()
  console.log('Job ended')
}

module.exports = {startEndReminderCronJob}
