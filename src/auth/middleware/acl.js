'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      } else {
        next('Access Denied');
      }
    } catch (e) {
      console.error('Error in acl.js:', e.message);
      next('Invalid Login');
    }
  };
};
