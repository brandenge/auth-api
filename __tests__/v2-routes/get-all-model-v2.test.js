'use strict';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db, user, food, clothes } = require('../../src/models/index');
const base64 = require('base-64');

const newUser1 = {
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
  await clothes.create(newClothes);
  await food.create(newFood);
});

afterAll(async () => {
  await db.drop();
  await db.close();
});

describe('Testing the v2 GET methods/routes for getting all items with read access', () => {
  it('Gets all existing clothing items with read access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.get('/api/v2/clothes').set('Authorization', `Bearer ${bearerToken}`).send();
    expect(getAllResponse.status).toEqual(200);
  });

  it('Denies access to getting all clothing items without read access', async () => {
    const getAllResponse = await mockRequest.get('/api/v2/clothes').set('Authorization', 'Bearer invalidBearerToken').send();
    expect(getAllResponse.status).toEqual(500);
  });

  it('Gets all existing food items with read access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.get('/api/v2/food').set('Authorization', `Bearer ${bearerToken}`).send();
    expect(getAllResponse.status).toEqual(200);
  });

  it('Denies access to getting all food items without read access', async () => {
    const getAllResponse = await mockRequest.get('/api/v2/food').set('Authorization', 'Bearer invalidBearerToken').send();
    expect(getAllResponse.status).toEqual(500);
  });
});
