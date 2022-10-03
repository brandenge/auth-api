'use strict';

const errorHandler = require('../../src/error-handlers/500');

describe('Test 500 middleware', () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };

  it('Returns the correct res with an error object', () => {
    const err = { message: 'This is a 500 error object' };
    const req = {
      originalUrl: 'Request URL1',
      query: 'Request query object1',
      body: 'Request body1',
      message: err,
    };

    errorHandler(err, req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      error: 500,
      route: 'Request URL1',
      query: 'Request query object1',
      body: 'Request body1',
      message: `SERVER ERROR: ${err.message}`,
    });
  });

  it('Returns the correct res with an error string', () => {
    const err = 'This is a 500 error string';
    const req = {
      originalUrl: 'Request URL2',
      query: 'Request query object2',
      body: 'Request body2',
      message: err,
    };

    errorHandler(err, req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      error: 500,
      route: 'Request URL2',
      query: 'Request query object2',
      body: 'Request body2',
      message: 'This is a 500 error string',
    });
  });
});
