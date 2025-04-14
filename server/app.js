// File: /backend/src/app.js
import express from 'express';
import cors from 'cors';
// Correct way to import sequelize from models/index.js
import models from './models/index.js';
const { sequelize } = models;
// Import routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import storeRoutes from './routes/store.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import storeOwnerRoutes from './routes/storeOwner.routes.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log all request details
app.use((req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Path:', req.path);
  console.log('Query:', req.query);
  console.log('Params:', req.params);
  console.log('Headers:', req.headers);
  next();
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// public routes
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

// Database connection
async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sync database in development
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

initDb();

export default app;
