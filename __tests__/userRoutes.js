const request = require('supertest')
const app = require('../app')

describe('Login route test', () => {
    test('When username and password are present, should respond with a 200 status code', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'danielsumah@gmail.com',
            password: "Daniel"
        })        
        expect(response.statusCode).toBe(200);
    })
    test('When email and password are missing, should respond with a 400 status code', async () => {
        const response = await request(app).post('/user/login').send({})        
        expect(response.statusCode).toBe(400);
    })
    test('When email is missing, should respond with a 400 status code', async () => {
        const response = await request(app).post('/user/login').send({
            password: "Daniel"
        })        
        expect(response.statusCode).toBe(400);
    })
    test('When password is missing, should respond with a 400 status code', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'danielsumah@gmail.com'
        })        
        expect(response.statusCode).toBe(400);
    })
    test('Should send back json type for a successful request', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'danielsumah@gmail.com',
            password: "Daniel"
        })        
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    })
})