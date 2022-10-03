'use strict';

const base64 = require('base-64');
const { user } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(401).send('Invalid Login');
    }
    const basic = req.headers.authorization.split(' ')[1];
    const [username, password] = base64.decode(basic).split(':');
    req.user = await user.authenticateBasic(username, password);
    next();
  } catch (e) {
    console.error('Error in basic.js:', e.message);
    next('Invalid Login');
  }
};
