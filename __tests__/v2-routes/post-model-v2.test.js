'use strict';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db, user } = require('../../src/models/index');
const base64 = require('base-64');

const newUser1 = {
  username: 'Joe',
  password: 'joepass',
  role: 'writer',
};

const newUser2 = {
  username: 'Bob',
  password: 'bobpass',
  role: 'user',
};

const newClothes = {
  name: 'shirt',
  color: 'blue',
  size: 'large',
};

const newFood = {
  name: 'apple',
  calories: 110,
  type: 'fruit',
};

beforeAll(async () => {
  await db.sync();
  await user.create(newUser1);
  await user.create(newUser2);
});

afterAll(async () => {
  await db.drop();
  await db.close();
});

describe('Testing the v2 POST methods/routes for creating/adding new items with write access', () => {
  it('Adds/creates a new clothing item with write access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.post('/api/v2/clothes').set('Authorization', `Bearer ${bearerToken}`).send(newClothes);
    expect(getAllResponse.status).toEqual(201);
  });

  it('Denies access to creating/adding a new clothing item without write access', async () => {
    const token = base64.encode(`${newUser2.username}:${newUser2.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.post('/api/v2/clothes').set('Authorization', `Bearer ${bearerToken}`).send(newClothes);
    expect(getAllResponse.status).toEqual(500);
  });

  it('Adds/creates a new food item with write access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.post('/api/v2/food').set('Authorization', `Bearer ${bearerToken}`).send(newFood);
    expect(getAllResponse.status).toEqual(201);
  });

  it('Denies access to creating/adding a new food item without write access', async () => {
    const token = base64.encode(`${newUser2.username}:${newUser2.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.post('/api/v2/clothes').set('Authorization', `Bearer ${bearerToken}`).send(newFood);
    expect(getAllResponse.status).toEqual(500);
  });
});
