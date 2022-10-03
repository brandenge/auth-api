'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const clothesModel = require('./clothes.js');
const foodModel = require('./food.js');
const userModel = require('../auth/models/users.js');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite::memory'
  : process.env.DATABASE_URL;

const DATABASE_CONFIG = process.env.NODE_ENV === 'production'
  ? {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    typeValidation: true,
  } : {
    logging: false,
    typeValidation: true,
  };

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);
const user = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  food: new Collection(food),
  clothes: new Collection(clothes),
  user,
};
