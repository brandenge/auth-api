'use strict';

const { start } = require('./src/server.js');
const { db } = require('./src/models');

async function startServer() {
  try {
    await db.sync();
    console.log('Database successfully connected');
    start(process.env.PORT || 3002);
  } catch (e) {
    console.error('Error in startServer:', e.message);
    throw new Error(e);
  }
}

startServer();
