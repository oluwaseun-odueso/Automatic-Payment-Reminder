const axios = require('axios')

axios.get('https://jsonplaceholder.typicode.com/todos/1')
    .then(feedback => console.log(feedback.data))
    .catch(error => console.log(error))

    
const data = {
    title: 'Ann',
    body: 'Peter',
    userId: 5
}
axios.post('https://jsonplaceholder.typicode.com/posts', data)
.then(response => console.log(response.status, response.data))
.catch(error => console.log(error.response.data))