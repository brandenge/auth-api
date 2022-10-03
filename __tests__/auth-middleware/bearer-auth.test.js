'use strict';

process.env.SECRET = 'TEST_SECRET';

const bearerAuth = require('../../src/auth/middleware/bearer');
const { db, user } = require('../../src/models/index');
const jwt = require('jsonwebtoken');

const newUser = {
  username: 'BobTheAdmin',
  password: 'AdminPass',
  role: 'admin',
};

beforeAll(async () => {
  await db.sync();
  await user.create(newUser);
});
afterAll(async () => {
  await db.drop();
});

describe('Test the bearer authentication middleware', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  it('Authenticates a user with a valid token', async () => {
    const userObj = { username: newUser.username };
    const token = jwt.sign(userObj, process.env.SECRET);
    req.headers = {
      authorization: `Bearer ${token}`,
    };
    await bearerAuth(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('Does not authenticate a user with an invalid token', async () => {
    req.headers = {
      authorization: 'Bearer invalidToken',
    };
    await bearerAuth(req, res, next);
    expect(next).toHaveBeenCalledWith('Invalid Login');
  });
});
