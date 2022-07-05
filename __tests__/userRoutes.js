const request = require('supertest')
const app = require('../app')

let token ;

// beforeAll(done => {
//   request(app)
//   .post('/user/login')
//   .send({
//     email: 'danielsumah@gmail.com',
//     password: "Daniel"
//   })
//   .end((err, response) => {
//     token = response.body.token;
//     done()
//   })
// });

beforeAll(async () => {
    const response = await request(app).post('/user/login')
    .send({
        email: 'blessed@gmail.com',
        password: "blessed"
      })
    token = response.body.token;
  });

describe('Login route test', () => {
    test('With valid login details', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'bawa@gmail.com',
            password: "bawa"
        })        
        expect(response.body.message).toBe("You have successfully logged in")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(200);
    }) 

    test('When email does not exist', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'danielssumah@gmail.com',
            password: "Daniel"
        })        
        expect(response.body.message).toBe("Email does not exist")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    }) 

    test('When password is incorrect', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'danielsumah@gmail.com',
            password: "Danielsko"
        })        
        expect(response.body.message).toBe("You have entered an incorrect password")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    }) 

    test('When email and password are missing', async () => {
        const response = await request(app).post('/user/login').send({})  
        expect(response.body.message).toBe("Please enter all fields")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));      
        expect(response.statusCode).toBe(400);
    }) 
    // test('When email is missing, should respond with a 400 status code', async () => {
    //     const response = await request(app).post('/user/login').send({
    //         password: "Daniel"
    //     })        
    //     expect(response.statusCode).toBe(400);
    // })
    // test('When password is missing, should respond with a 400 status code', async () => {
    //     const response = await request(app).post('/user/login').send({
    //         email: 'danielsumah@gmail.com'
    //     })        
    //     expect(response.statusCode).toBe(400);
    // })
})

describe('Sign up route test', () => {
    test('201 status code when all fields are present, a successful request', async () => {
        const response = await request(app).post('/user/signUp').send({
            first_name: "Bola",
            last_name: "Ade",
            business_name: "Bolade Consults",
            payment_link: "www.boladeconsults.com",
            email: "bola16@gmail.com",
            phone_number: "080527485103",
            password: "bola1",
            confirm_password: "bola1"
        })        
        expect(response.body.message).toBe("New user added")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(201);
    })

    test('When email already exists', async () => {
        const response = await request(app).post('/user/signUp').send({
            first_name: "Bola",
            last_name: "Ade",
            business_name: "Bolade Consults",
            payment_link: "www.boladeconsults.com",
            email: "seunoduez@gmail.com",
            phone_number: "090309554813",
            password: "bola1",
            confirm_password: "bola1"
        })        
        expect(response.body.message).toBe("Email already exists")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })

    test('When phone number already exists', async () => {
        const response = await request(app).post('/user/signUp').send({
            first_name: "Bola",
            last_name: "Ade",
            business_name: "Bolade Consults",
            payment_link: "www.boladeconsults.com",
            email: "seune1o1due1z@gmail.com",
            phone_number: "09070748103",
            password: "bola1",
            confirm_password: "bola1"
        })        
        expect(response.body.message).toBe("Phone number already exists")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })

    test("When email and phone_number already exists", async () => {
        const response = await request(app).post('/user/signUp').send({
            first_name: "Bola1",
            last_name: "Ade1",
            business_name: "Bolade Consults1",
            payment_link: "www.boladeconsults1.com",
            email: "seunoduez@gmail.com",
            phone_number: "09066318539",
            password: "bola1",
            confirm_password: "bola1"
        })        
        expect(response.body.message).toBe("Email and phone number already exists")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })

    test('When password and confirm password do not match', async () => {
        const response = await request(app).post('/user/signUp').send({
            first_name: "Bola",
            last_name: "Ade",
            business_name: "Bolade Consults",
            payment_link: "www.boladeconsults.com",
            email: "seunoduez10@gmail.com",
            phone_number: "090309816555",
            password: "bola2",
            confirm_password: "bola1"
        })        
        expect(response.body.message).toBe("Passwords do not match.")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })

    test('When all fields are missing', async () => {
        const response = await request(app).post('/user/login').send({})        
        expect(response.body.message).toBe("Please enter all fields")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })
})

describe('Update account details route', () => {
    test('201 status code for a successful request, valid update details', async () => {
        const response = await request(app)
        .patch('/user/update_account_details')
        .set('Authorization', `Bearer ${token}`)
        .send({
            first_name: "Dan",
            last_name: "Isunoya",
            business_name: "Daniiieee Shoes",
            payment_link: "https://paystack.com/pay/timpel",
            email: "danielsumah@gmail.com",
            phone_number: "09029326141"
        })
        expect(response.body.message).toBe("Account details updated")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(200);
    })

    test('When new email already exists', async () => {
        const response = await request(app)
        .patch('/user/update_account_details')
        .set('Authorization', `Bearer ${token}`)
        .send({
            first_name: "Dan",
            last_name: "Isunoya",
            business_name: "Daniiieee Shoes",
            payment_link: "https://paystack.com/pay/timpel",
            email: "seunoduez@gmail.com",
            phone_number: "09029326141"
        })
        console.log(response.body)
        expect(response.body.message).toBe("Email already exists")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })

    test('When new phone_number already exists', async () => {
        const response = await request(app)
        .patch('/user/update_account_details')
        .set('Authorization', `Bearer ${token}`)
        .send({
            first_name: "Dan",
            last_name: "Isunoya",
            business_name: "Daniiieee Shoes",
            payment_link: "https://paystack.com/pay/timpel",
            email: "danielsumah@gmail.com",
            phone_number: "09066318539"
        })
        expect(response.body.message).toBe("Phone number already exists")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })

    test('When req.body is empty', async () => {
        const response = await request(app)
        .patch('/user/update_account_details')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        expect(response.body.message).toBe("Please enter all fields")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })
})

describe('Get a user route', () => {
    test('Successful request to get a user', async () => {
        const response = await request(app)
        .get('/user/get_a_user')
        .set('Authorization', `Bearer ${token}`)
        expect(response.body.message).not.toBe("User does not exist")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(200);
    })
})

describe('Delete user route', () => {
    test('Successfully delete a user', async () => {
        const response = await request(app)
        .delete('/user/delete_account')
        .set('Authorization', `Bearer ${token}`)
        expect(response.body.message).toBe("Your account has been deleted.")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(200);
    })
})

describe('Get all users route', () => {
    test('Get all users', async () => {
        const response = await request(app)
        .get('/user/get_all_users')
        .set('Authorization', `Bearer ${token}`)
        expect(response.body.message).not.toBe("All users")
        expect(response.body.message).toBe("You are unauthourized to perform this action")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.statusCode).toBe(400);
    })
})
