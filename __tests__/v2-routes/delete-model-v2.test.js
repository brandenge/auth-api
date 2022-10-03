'use strict';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db, user, food, clothes } = require('../../src/models/index');
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

describe('Testing the /delete route for v1', () => {
  it('Deletes an existing clothing item with delete access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const deleteResponse = await mockRequest.delete('/api/v2/clothes/1').set('Authorization', `Bearer ${bearerToken}`).send();
    expect(deleteResponse.status).toEqual(200);
  });

  it('Does not allow deleting a clothing item without delete access', async () => {
    const token = base64.encode(`${newUser2.username}:${newUser2.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const deleteResponse = await mockRequest.delete('/api/v2/clothes/1').set('Authorization', `Bearer ${bearerToken}`).send();
    expect(deleteResponse.status).toEqual(500);
  });

  it('Deletes an existing food item with delete access', async () => {
    const token = base64.encode(`${newUser1.username}:${newUser1.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const deleteResponse = await mockRequest.delete('/api/v2/food/1').set('Authorization', `Bearer ${bearerToken}`).send();
    expect(deleteResponse.status).toEqual(200);
  });

  it('Does not allow deleting a food item without delete access', async () => {
    const token = base64.encode(`${newUser2.username}:${newUser2.password}`);
    const response = await mockRequest.post('/signin').set('Authorization', `Basic ${token}`).send();
    const bearerToken = response.body.token;
    const deleteResponse = await mockRequest.delete('/api/v2/food/1').set('Authorization', `Bearer ${bearerToken}`).send();
    expect(deleteResponse.status).toEqual(500);
  });
});
