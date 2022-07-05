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

describe('Add client route', () => {
  test('Valid add client request', async () => {
      const response = await request(app)
      .post('/client/create_client')
      .set('Authorization', `Bearer ${token}`)
      .send({
          "name": "Gan Peters",
          "email": "ganpeters2@gmail.com",
          "phone_number": "09048855281"
      })
      expect(response.body.message).toBe("New client added")
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(response.statusCode).toBe(201);
  })

  test('Add client with an existing email', async () => {
    const response = await request(app)
    .post('/client/create_client')
    .set('Authorization', `Bearer ${token}`)
    .send({
        "name": "Gan Peters",
        "email": "ganpeters@gmail.com",
        "phone_number": "09048845282"
    })
    expect(response.body.message).toBe("Email already exists")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })

  test('Add client with an existing phone number', async () => {
    const response = await request(app)
    .post('/client/create_client')
    .set('Authorization', `Bearer ${token}`)
    .send({
        "name": "Gan Peters",
        "email": "ganpeters3@gmail.com",
        "phone_number": "09048845282"
    })
    expect(response.body.message).toBe("Phone number already exists")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })

  test('Add client with an existing email and phone number', async () => {
    const response = await request(app)
    .post('/client/create_client')
    .set('Authorization', `Bearer ${token}`)
    .send({
        "name": "Gan Peters",
        "email": "ganpeters@gmail.com",
        "phone_number": "09048845282"
    })
    expect(response.body.message).toBe("Email and phone number already exists")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })

  test('Add client with no client details', async () => {
    const response = await request(app)
    .post('/client/create_client')
    .set('Authorization', `Bearer ${token}`)
    .send({})
    expect(response.body.message).toBe("Please enter all required fields")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })
})
