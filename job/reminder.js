const cron = require('node-cron');
const SendEmail = require('../config/emailConfig')

// const invoice_reminder = cron.schedule('* * * * *', async () => {
//   SendEmail.sendReminder(invoice, payment_link)
//   console.log('running a task every minute');
//   }, {
//     scheduled: false
//   });

function invoice_reminder (invoice, payment_link, payment_status) {
  if (payment_status === 'unpaid') {
    cron.schedule('*/20 * * * * *', async () => {
      await SendEmail.sendReminder(invoice, payment_link)
      console.log('Running a task every 20 seconds')
    });
  }
  
}

module.exports = invoice_reminder
