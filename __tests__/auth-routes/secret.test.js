'use strict';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db, user } = require('../../src/models/index');
const base64 = require('base-64');

const newUser = {
  username: 'Joe',
  password: 'joepass',
  role: 'user',
};

beforeAll(async () => {
  await db.sync();
  await user.create(newUser);
});

afterAll(async () => {
  await db.drop();
  await db.close();
});

describe('Testing the /secret route', () => {
  it('Succeeds when bearer authentication succeeds', async () => {
    const token = base64.encode(`${newUser.username}:${newUser.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const secretResponse = await mockRequest.get('/secret').set('Authorization', `Bearer ${bearerToken}`);
    expect(secretResponse.status).toEqual(200);
    expect(secretResponse.text).toEqual('Welcome to the secret area');
  });

  it('Fails when bearer authentication fails', async () => {
    const secretResponse = await mockRequest.get('/secret').set('Authorization', `Bearer invalidToken`);
    expect(secretResponse.status).toEqual(500);
  });
});
