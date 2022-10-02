'use strict';

const base64 = require('base-64');
const { user } = require('../../models');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) return _authError();
  let basic = req.headers.authorization.split(' ')[1];
  let [username, password] = base64.decode(basic).split(':');
  try {
    req.user = await user.authenticateBasic(username, password);
    next();
  } catch (e) {
    console.error('Error in basic.js:', e.message);
    _authError();
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }
};
