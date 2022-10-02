'use strict';

const express = require('express');
const authRouter = express.Router();

const { user } = require('../models');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');

authRouter.post('/signup', async (req, res, next) => {
  try {
    let userRecord = await user.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    console.error('Error in /signup route:', e.message);
    next(e);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  try {
    const userRecords = await user.findAll();
    const list = userRecords.map(user => user.username);
    res.status(200).json(list);
  } catch (e) {
    console.error('Error in /users route:', e.message);
    next(e);
  }
});

authRouter.get('/secret', bearerAuth, (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});

module.exports = authRouter;
