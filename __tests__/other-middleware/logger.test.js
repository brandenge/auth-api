'use strict';

const logger = require('../../src/middleware/logger');

describe('Test logger middleware', () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});

  it('Returns the correct res with an error object', () => {
    const req = {
      method: 'GET',
      originalUrl: '/testUrl',
    };
    const res = {};
    const next = jest.fn();

    logger(req, res, next);
    expect(log).toHaveBeenCalledWith(`From Logger - Request method: ${req.method}, Request path: ${req.originalUrl}`);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  log.mockReset();
});
