'use strict';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db } = require('../../src/models/index');

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
  await db.close();
});

describe('Testing the v1 POST methods/routes for creating/adding a new item', () => {
  it('Creates/adds a new clothing item', async () => {
    const newClothes = {
      name: 'shirt',
      color: 'blue',
      size: 'large',
    };
    const response = await mockRequest.post('/api/v1/clothes').send(newClothes);
    expect(response.status).toEqual(201);
  });

  it('Creates/adds a new food item', async () => {
    const newFood = {
      name: 'apple',
      calories: 110,
      type: 'fruit',
    };
    const response = await mockRequest.post('/api/v1/food').send(newFood);
    expect(response.status).toEqual(201);
  });
});
