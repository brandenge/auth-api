'use strict';

module.exports = (err, req, res) => {
  res.status(500).send({
    error: 500,
    route: req.originalUrl,
    query: req.query,
    body: req.body,
    message: typeof err === 'string' ? err : `SERVER ERROR: ${err.message}`,
  });
};
