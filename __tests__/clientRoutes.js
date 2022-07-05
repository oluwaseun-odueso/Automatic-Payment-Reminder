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

describe('Update client details route', () => {
  test('With valid client new details', async () => {
    const response = await request(app)
    .patch(`/client/update_client_details/${31}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
        "name": "Gan Peterson",
        "email": "ganipeters@gmail.com",
        "phone_number": "07048845282"
    })
    expect(response.body.message).toBe("Successfully updated client details")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(200);
  })

  test('A non existing client', async () => {
    const response = await request(app)
    .patch(`/client/update_client_details/${40}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
        "name": "Gan Peterson",
        "email": "ganpeters@gmail.com",
        "phone_number": "09071841522"
    })
    expect(response.body.message).toBe("Client does not exist")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })


  test('With existing email', async () => {
    const response = await request(app)
    .patch(`/client/update_client_details/${31}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
        "name": "Gan Peterson",
        "email": "midebanks@gmail.com",
        "phone_number": "07048845282"
    })
    expect(response.body.message).toBe("Email already exists")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })

  test('With existing phone number', async () => {
    const response = await request(app)
    .patch(`/client/update_client_details/${31}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
        "name": "Gan Peterson",
        "email": "ganpeters@gmail.com",
        "phone_number": "09071841522"
    })
    expect(response.body.message).toBe("Phone number already exists")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })

  test('With no detail field', async () => {
    const response = await request(app)
    .patch(`/client/update_client_details/${31}`)
    .set('Authorization', `Bearer ${token}`)
    .send({})
    expect(response.body.message).toBe("Please enter all fields")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })
})


describe('Get a client route', () => {
  test('Get a client', async () => {
    const response = await request(app)
    .get(`/client/get_client/${31}`)
    .set('Authorization', `Bearer ${token}`)
    expect(response.body.message).not.toBe("Client does not exist")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(200);
  })
})

describe('Get all clients route', () => {
  test('Get all clients', async () => {
    const response = await request(app)
    .get('/client/get_all_clients')
    .set('Authorization', `Bearer ${token}`)
    expect(response.body.message).toBe("All clients")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(200);
  })
})

describe('Delete client route', () => {
  test('With valid client id', async () => {
    const response = await request(app)
    .delete(`/client/delete_client/${36}`)
    .set('Authorization', `Bearer ${token}`)
    expect(response.body.message).toBe("Client has been deleted")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(200);
  })

  test('With non-valid client id', async () => {
    const response = await request(app)
    .delete(`/client/delete_client/${34}`)
    .set('Authorization', `Bearer ${token}`)
    expect(response.body.message).toBe("Client does not exist")
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.statusCode).toBe(400);
  })
})