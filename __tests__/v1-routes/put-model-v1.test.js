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

describe('Testing the v1 PUT methods/routes for updating a single item by id', () => {
  it('Updates a clothing item by id', async () => {
    const response = await mockRequest.put('/api/v1/clothes/1').send({ color: 'orange' });
    expect(response.status).toEqual(200);
  });

  it('Updates a food item by id', async () => {
    const response = await mockRequest.put('/api/v1/food/1').send({ calories: 90 });
    expect(response.status).toEqual(200);
  });
});
