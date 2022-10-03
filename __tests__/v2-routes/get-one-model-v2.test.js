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

describe('Testing the v2 GET methods for getting a single item', () => {
  it('Gets a clothing item by id with read access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.get('/api/v2/clothes/1').set('Authorization', `Bearer ${bearerToken}`).send();
    expect(getAllResponse.status).toEqual(200);
  });

  it('Denies access to getting a clothing item without read access', async () => {
    const getAllResponse = await mockRequest.get('/api/v2/clothes/1').set('Authorization', 'Bearer invalidBearerToken').send();
    expect(getAllResponse.status).toEqual(500);
  });

  it('Gets a food item by id with read access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.get('/api/v2/food/1').set('Authorization', `Bearer ${bearerToken}`).send();
    expect(getAllResponse.status).toEqual(200);
  });

  it('Denies access to getting a food item without read access', async () => {
    const getAllResponse = await mockRequest.get('/api/v2/food/1').set('Authorization', 'Bearer invalidBearerToken').send();
    expect(getAllResponse.status).toEqual(500);
  });
});
