// File: /backend/src/config/auth.js
export default {
    secret: process.env.JWT_SECRET || 'harsh123',
    expiresIn: '24h'
  };