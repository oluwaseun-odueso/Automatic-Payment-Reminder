const cron = require('node-cron')

const invoice_reminder = cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
  }, {
    scheduled: false
  });

module.exports = invoice_reminder