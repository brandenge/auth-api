'use strict';

const logger = (req, res, next) => {
  console.log(`From Logger - Request method: ${req.method}, Request path: ${req.path}`);
  next();
};

module.exports = logger;
