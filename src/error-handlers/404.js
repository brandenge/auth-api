'use strict';

module.exports = function (req, res, next) {
  const errorObject = {
    error: 404,
    route: req.originalUrl,
    message: 'Sorry, we could not find what you were looking for',
  };
  res.status(404).send(errorObject);
};
