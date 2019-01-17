'use strict';
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JTW_SECRET || '123456789ABCabcQWERTYUIOPqwertyuiop1234567890'

let auth = {
  signCode: (data, expiryInHours) => {
    let token = jwt.sign(data, jwtSecret, { expiresIn: `${expiryInHours}h` });
    return (token)
  },
  isCodeActive: async (signature) => {
    return jwt.verify(signature, jwtSecret, function (e, code) {
      if (e) {
        return false
      }
      else {
       return code;
      }
    });
  },
};

module.exports = auth;