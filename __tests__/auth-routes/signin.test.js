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

describe('Testing the /signin route', () => {
  it('Allows a valid user to signin with a POST to /signin', async () => {
    const token = base64.encode(`${newUser.username}:${newUser.password}`);
    const response = await mockRequest.post(`/signin`).set('Authorization', `Basic ${token}`).send();
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual(newUser.username);
    expect(response.body.password).toBeTruthy();
    expect(response.body.password).not.toEqual(newUser.password);
  });

  it('Triggers an error when an invalid user attempts to signin with a POST to /signin', async () => {
    const response = await mockRequest.post(`/signin`).send();
    console.log('response status', response.status);
    expect(response.status).toEqual(401);
  });
});
