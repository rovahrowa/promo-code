'use strict';
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JTW_SECRET || '123456789ABCabcQWERTYUIOPqwertyuiop1234567890'

let auth = {
    signCode: (data, expiryInHours) => {
        let token = jwt.sign(data, jwtSecret, { expiresIn: `${expiryInHours}h` });
        return (token)
      }
};

module.exports = auth;