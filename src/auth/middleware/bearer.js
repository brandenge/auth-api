'use strict';

const { user } = require('../../models/index');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) _authError();
    const token = req.headers.authorization.split(' ')[1];
    const validUser = await user.authenticateToken(token);
    if (validUser) {
      req.user = validUser;
      req.token = validUser.token;
      next();
    }
  } catch (e) {
    console.error('Error in bearer.js:', e.message);
    _authError();
  }

  function _authError() {
    next('Invalid Login');
  }
};
