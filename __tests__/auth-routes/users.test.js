'use strict';

process.env.SECRET = 'TEST_SECRET';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db, user } = require('../../src/models/index');
const base64 = require('base-64');

const newUser1 = {
  username: 'Joe',
  password: 'joepass',
  role: 'admin',
};

const newUser2 = {
  username: 'Bob',
  password: 'bobpass',
  role: 'editor',
};

beforeAll(async () => {
  await db.sync();
  await user.create(newUser1);
});

afterAll(async () => {
  await db.drop();
  await db.close();
});

describe('Testing the /users route', () => {
  it('Succeeds only for admin users', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const usersResponse = await mockRequest.get('/users').set('Authorization', `Bearer ${bearerToken}`);
    expect(usersResponse.status).toEqual(200);
  });

  it('Fails for non-admin users', async () => {
    const token = base64.encode(`${newUser2.username}:${newUser2.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const usersResponse = await mockRequest.get('/users').set('Authorization', `Bearer ${bearerToken}`);
    expect(usersResponse.status).toEqual(500);
  });
});
