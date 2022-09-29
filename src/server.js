'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./routes/routes.js');
const logger = require('./middleware/logger.js');
const v1Routes = require('./routes/v1.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/api/v1', v1Routes);
app.use(authRoutes);

// Catchalls
app.use('*', notFound);
app.use(errorHandler);

function start(port) {
  if (!port) next('Missing Port');
  app.listen(port, () => console.log(`Server up and running on ${port}`));
}

module.exports = { app, start };
