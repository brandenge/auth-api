'use strict';

const { db, user } = require('../../src/models');
const basicAuth = require('../../src/auth/middleware/basic');
const base64 = require('base-64');

const newUser = {
  username: 'Joe Bob',
  password: 'testpassword',
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

describe('Test the basic authentication middleware', () => {

  it('Authenticates a valid user', async () => {
    const basicAuthString = base64.encode(`${newUser.username}:${newUser.password}`);

    const req = {
      headers: {
        authorization: `Basic ${basicAuthString}`,
      },
    };
    const res = {};
    const next = jest.fn();
    await basicAuth(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('Does not authenticate an invalid user', async () => {
    const req = {
      headers: {
        authorization: 'Basic invalidCredentials',
      },
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res),
    };
    const next = jest.fn();
    await basicAuth(req, res, next);
    expect(next).toHaveBeenCalledWith('Invalid Login');
  });
});
