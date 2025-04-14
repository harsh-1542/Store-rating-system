// File: /backend/src/routes/rating.routes.js
import express from 'express';
import { 
  createRating, 
  getStoreRatings, 
  getUserRating, 
  updateRating, 
  deleteRating,
  getStoreAverageRating,
  getAllRatings
} from '../controllers/rating.controller.js';
import { verifyToken } from '../middleware/auth.js'; // Assuming you have this middleware

const router = express.Router();

// All rating endpoints require authentication
router.use(verifyToken);

// Create or update a rating
router.post('/', createRating);

// Add this route to your existing /backend/src/routes/rating.routes.js file

// Get all ratings (paginated)
router.get('/', getAllRatings);

// Get all ratings for a store
router.get('/store/:storeId', getStoreRatings);

// Get user's rating for a store
router.get('/user/store/:storeId', getUserRating);

// Update an existing rating (alternative to POST which handles both create and update)
router.put('/', updateRating);

// Delete a rating
router.delete('/store/:storeId', deleteRating);

// Get average rating for a store
router.get('/store/:storeId/average', getStoreAverageRating);

export default router;