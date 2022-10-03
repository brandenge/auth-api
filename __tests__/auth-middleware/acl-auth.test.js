'use strict';

const accessControl = require('../../src/auth/middleware/acl');

describe('Test Access Control List middleware', () => {
  const res = {};
  const next = jest.fn();

  it('Grants access if the user has the access rights to do the action', () => {
    const req = {
      user: {
        capabilities: ['read', 'write', 'update', 'delete'],
      },
    };

    accessControl('delete')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('Denies access if the user does not have the access rights to do the action', () => {
    const req = {
      user: {
        capabilities: ['read'],
      },
    };
    accessControl('delete')(req, res, next);
    expect(next).toHaveBeenCalledWith('Access Denied');
  });

  it('Throws an error if the .capabilities property is not a valid data type', () => {
    const req = {
      user: {
        capabilities: 23,
      },
    };
    accessControl('delete')(req, res, next);
    expect(next).toHaveBeenCalledWith('Invalid Login');
  });
});
