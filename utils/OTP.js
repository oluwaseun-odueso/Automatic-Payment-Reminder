const axios = require('axios')


// app.get('/verify_payment', async (req, res) => {
//     try {
//         const response = await axios.get(`https://api.paystack.co/transaction/verify/${req.body.reference}`,{
//             headers: {
//                 "Content-type": "application/json; charset=UTF-8",
//                 "Authorization": 'Bearer ' + process.env.PAYSTACK_TOKEN
//             },
//         })
//         console.log(response.data.data.status)
//         res.send(response.data.data)
//     } catch (error) {
//         res.send(error)
//     }
// })

// app.post('/initialize_transaction', async (req, res) => {
//     try {
//         const data = '{ "amount": "50000" , "email": "seunoduez@gmail.com"}'
//         const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
//             headers: {
//                 "Content-type": "application/json; charset=UTF-8",
//                 "Authorization": 'Bearer ' + process.env.PAYSTACK_TOKEN
//             }
//         }, { timeout: 2000})
//         res.status(200).send(response.data)
//     } catch (error) {
//         if (error.message === 'getaddrinfo ENOTFOUND api.paystack.co') {
//             res.status(500).send({message: "Check your network connection and try again"})
//         }
//     }
// })
