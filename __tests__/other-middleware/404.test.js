'use strict';

const errorHandler = require('../../src/error-handlers/404');

describe('Test 404 middleware', () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };

  it('Returns the correct res with an error object', () => {
    const req = {
      originalUrl: 'Request URL3',
    };

    errorHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      error: 404,
      route: 'Request URL3',
      message: 'Sorry, we could not find what you were looking for',
    });
  });
});
