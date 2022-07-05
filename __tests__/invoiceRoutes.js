const request = require('supertest')
const app = require('../app')

beforeAll(async () => {
    const response = await request(app).post('/user/login')
    .send({
        email: 'blessed@gmail.com',
        password: "blessed"
      })
    token = response.body.token;
  });

describe('Create invoice route', () => {
  test('Successful create request', async () => {
      const response = await request(app)
      .post('/invoice/create_invoice')
      .set('Authorization', `Bearer ${token}`)
      .send({
        "client_id": 31,
        "item": "Vitafoam family bed",
        "quantity": 1,
        "unit_price": "28,000",
        "total": "28,000",
        "payment_status": "unpaid"
      })      
      expect(response.body.message).toBe("New invoice created")
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(response.statusCode).toBe(201);
  })

  test.only('Successful create request', async () => {
    const response = await request(app)
    .post('/invoice/create_invoice')
    .set('Authorization', `Bearer ${token}`)
    .send({})      
    expect(response.body.message).toBe("Please enter all fields correctly")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
})
})