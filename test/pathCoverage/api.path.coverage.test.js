const { expect } = require('chai');
const request = require('supertest');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Path Coverage - API paths from Swagger', function () {
  this.timeout(10000);

  it('POST /register - registers a new user', async function () {
    const uniqueSuffix = Date.now();
    const response = await request(BASE_URL)
      .post('/register')
      .send({
        username: `dave_${uniqueSuffix}`,
        email: `dave_${uniqueSuffix}@example.com`,
        password: 'password123'
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('message', 'User registered successfully');
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('username', `dave_${uniqueSuffix}`);
    expect(response.body.user).to.have.property('email', `dave_${uniqueSuffix}@example.com`);
    expect(response.body.user).to.have.property('id');
  });

  it('POST /login - authenticates user and returns JWT', async function () {
    const response = await request(BASE_URL)
      .post('/login')
      .send({
        username: 'alice',
        password: 'password123'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Login successful');
    expect(response.body).to.have.property('token').that.is.a('string').and.is.not.empty;
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.include({
      id: 1,
      username: 'alice',
      email: 'alice@example.com'
    });
  });

  it('POST /checkout - performs authenticated checkout with cash discount', async function () {
    const loginResponse = await request(BASE_URL)
      .post('/login')
      .send({
        username: 'alice',
        password: 'password123'
      });

    expect(loginResponse.status).to.equal(200);
    const token = loginResponse.body.token;

    const response = await request(BASE_URL)
      .post('/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { productId: 1, quantity: 2 },
          { productId: 3, quantity: 1 }
        ],
        paymentMethod: 'cash'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Checkout completed successfully');
    expect(response.body.user).to.include({ id: 1, username: 'alice' });
    expect(response.body.order).to.have.property('paymentMethod', 'cash');
    expect(response.body.order).to.have.property('subtotal', 249.97);
    expect(response.body.order).to.have.property('discountRate', 0.1);
    expect(response.body.order).to.have.property('discount', 25);
    expect(response.body.order).to.have.property('total', 224.97);
    expect(response.body.order.items).to.be.an('array').with.lengthOf(2);
  });

  it('GET /healthcheck - returns API health status', async function () {
    const response = await request(BASE_URL).get('/healthcheck');

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'ok');
    expect(response.body).to.have.property('message', 'API is healthy');
    expect(response.body).to.have.property('timestamp').that.is.a('string');
  });
});
