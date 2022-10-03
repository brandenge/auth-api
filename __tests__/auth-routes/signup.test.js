'use strict';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db } = require('../../src/models/index');

beforeAll (async () => {
  await db.sync();
});

afterAll (async () => {
  await db.drop();
  await db.close();
});

describe('Testing the /signup route', () => {
  it('Allows a user to signup with a valid POST to /signup', async () => {
    const user = {
      username: 'Joe1',
      password: 'joepass1',
      role: 'user',
    };
    const response = await mockRequest.post(`/signup`).send(user);
    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual(user.username);
    expect(response.body.user.password).toBeTruthy();
    expect(response.body.user.password).not.toEqual('joepass1');
  });

  it('Does not allow a user to signup with an invalid POST to /signup', async () => {
    const user = {
      user: 'Joe2',
      pass: 'joepass2',
    };
    const response = await mockRequest.post(`/signup`).send(user);
    expect(response.status).toEqual(403);
    expect(response.text).toEqual('There was an error creating the user');
  });
});
