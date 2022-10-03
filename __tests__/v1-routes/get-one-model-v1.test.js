'use strict';

const supertest = require('supertest');
const { app } = require('../../src/server');
const mockRequest = supertest(app);
const { db, food, clothes } = require('../../src/models/index');

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
  await clothes.create(newClothes);
  await food.create(newFood);
});

afterAll(async () => {
  await db.drop();
  await db.close();
});

describe('Testing the v1 GET methods/routes for getting a single item by id', () => {
  it('Gets an existing clothing item by id', async () => {
    const response = await mockRequest.get('/api/v1/clothes/1').send();
    expect(response.status).toEqual(200);
  });

  it('Gets an existing food item by id', async () => {
    const response = await mockRequest.get('/api/v1/food/1').send();
    expect(response.status).toEqual(200);
  });
});
