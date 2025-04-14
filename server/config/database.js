// File: /backend/src/config/database.js
export default {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'store-rating',
    dialect: 'postgres'  // or 'mysql' based on your choice
  };