const request = require('supertest')
const app = require('../app')
const {generateToken, verifyToken} = require('../config/auth')

describe('Login route test', () => {
    test('With valid login details', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'danielsumah@gmail.com',
            password: "Daniel"
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

// describe('Update account details route', () => {
//     test('201 status code for a successful request', async () => {
//         const response = await request(app).
//     })
// })