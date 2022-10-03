'use strict';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db, user, clothes, food } = require('../../src/models/index');
const base64 = require('base-64');

const newUser1 = {
  username: 'Joe',
  password: 'joepass',
  role: 'editor',
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
  await clothes.create(newClothes);
  await food.create(newFood);
});

afterAll(async () => {
  await db.drop();
  await db.close();
});

describe('Testing the v2 PUT methods/routes for updating an item by id with update access', () => {
  it('Updates a clothing item with update access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.put('/api/v2/clothes/1').set('Authorization', `Bearer ${bearerToken}`).send({ color: 'orange '});
    expect(getAllResponse.status).toEqual(200);
  });

  it('Denies access to updating a clothing item without update access', async () => {
    const token = base64.encode(`${newUser2.username}:${newUser2.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.put('/api/v2/clothes/1').set('Authorization', `Bearer ${bearerToken}`).send({ color: 'yellow' });
    expect(getAllResponse.status).toEqual(500);
  });

  it('Updates a food item with update access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.put('/api/v2/food/1').set('Authorization', `Bearer ${bearerToken}`).send({ calories: 80 });
    expect(getAllResponse.status).toEqual(200);
  });

  it('Denies access to updating a food item without update access', async () => {
    const token = base64.encode(`${newUser2.username}:${newUser2.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const getAllResponse = await mockRequest.put('/api/v2/clothes/1').set('Authorization', `Bearer ${bearerToken}`).send({ calories: 130 });
    expect(getAllResponse.status).toEqual(500);
  });
});
