// File: /backend/src/controllers/rating.controller.js
import models from '../models/index.js';
const { Rating, Store, User } = models;

export const createRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.userId; // Assuming this comes from your auth middleware
    
    // Validate input
    if (!store_id || !rating) {
      return res.status(400).send({ message: 'Store ID and rating are required' });
    }
    
    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).send({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).send({ message: 'Store not found' });
    }
    
    // Check if user has already rated this store
    const existingRating = await Rating.findOne({
      where: {
        store_id,
        user_id
      }
    });
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
      
      return res.status(200).send({
        message: 'Rating updated successfully',
        rating: existingRating
      });
    } else {
      // Create new rating
      const newRating = await Rating.create({
        store_id,
        user_id,
        rating
      });
      
      return res.status(201).send({
        message: 'Rating created successfully',
        rating: newRating
      });
    }
  } catch (error) {
    console.log({ message: error.message });
    return res.status(500).send({ message: error.message });
  }
};



// Add this function to your existing /backend/src/controllers/rating.controller.js file

export const getAllRatings = async (req, res) => {
    try {
      // Optional query parameters for pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      
      // Get all ratings with pagination
      const { count, rows: ratings } = await Rating.findAndCountAll({
        limit,
        offset,
        order: [['updated_at', 'DESC']], // Most recent ratings first
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'] // Only include non-sensitive user information
          },
          {
            model: Store,
            as: 'store',
            attributes: ['id', 'name', 'address', 'owner_id'] // Include relevant store information
          }
        ]
      });
      
      // Calculate total pages
      const totalPages = Math.ceil(count / limit);
      
      return res.status(200).send({
        totalRatings: count,
        totalPages,
        currentPage: page,
        ratingPerPage: limit,
        ratings
      });
    } catch (error) {
      console.log({ message: error.message });
      return res.status(500).send({ message: error.message });
    }
  };

export const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).send({ message: 'Store not found' });
    }
    
    // Get all ratings for the store
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'] // Only include non-sensitive information
        }
      ]
    });
    
    // Calculate average rating
    let totalRating = 0;
    ratings.forEach(rating => {
      totalRating += rating.rating;
    });
    
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
    
    return res.status(200).send({
      count: ratings.length,
      averageRating: averageRating.toFixed(1),
      ratings
    });
  } catch (error) {
    console.log({ message: error.message });
    return res.status(500).send({ message: error.message });
  }
};


// Modified getStoreRatings function

export const getRatingsByStore = async (req, res) => {
    try {
      const { storeId } = req.params;
      
      // Get pagination and search parameters from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      
      // Calculate offset for pagination
      const offset = (page - 1) * limit;
      
      // Check if store exists
      const store = await Store.findByPk(storeId);
      if (!store) {
        return res.status(404).send({ message: 'Store not found' });
      }
      
      // Build where clause
      const whereClause = { store_id: storeId };
      
      // Build include clause with search condition if search term is provided
      const includeClause = [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          // If search is provided, search in user name
          ...(search && {
            where: {
              name: {
                [models.Sequelize.Op.iLike]: `%${search}%`
              }
            }
          })
        }
      ];
      
      // Count total ratings matching search criteria
      const totalCount = await Rating.count({
        where: whereClause,
        include: includeClause
      });
      
      // Get ratings with pagination and sorting
      const ratings = await Rating.findAll({
        where: whereClause,
        include: includeClause,
        limit,
        offset,
        order: [['created_at', 'DESC']] // Most recent first
      });
      
      // Calculate average rating across all ratings for this store (not just current page)
      const allRatings = await Rating.findAll({
        where: { store_id: storeId },
        attributes: ['rating']
      });
      
      let totalRating = 0;
      allRatings.forEach(rating => {
        totalRating += rating.rating;
      });
      
      const averageRating = allRatings.length > 0 ? totalRating / allRatings.length : 0;
      
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);
      
      return res.status(200).send({
        storeId,
        totalCount,
        count: ratings.length,
        totalPages,
        currentPage: page,
        averageRating: averageRating.toFixed(1),
        ratings
      });
    } catch (error) {
      console.log({ message: error.message });
      return res.status(500).send({ message: error.message });
    }
  };

export const getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const user_id = req.userId;
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).send({ message: 'Store not found' });
    }
    
    // Get user's rating for the store
    const rating = await Rating.findOne({
      where: {
        store_id: storeId,
        user_id
      }
    });
    
    if (!rating) {
      return res.status(404).send({ message: 'Rating not found' });
    }
    
    return res.status(200).send(rating);
  } catch (error) {
    console.log({ message: error.message });
    return res.status(500).send({ message: error.message });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.userId;
    
    // Validate input
    if (!store_id || !rating) {
      return res.status(400).send({ message: 'Store ID and rating are required' });
    }
    
    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).send({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if rating exists
    const existingRating = await Rating.findOne({
      where: {
        store_id,
        user_id
      }
    });
    
    if (!existingRating) {
      return res.status(404).send({ message: 'Rating not found' });
    }
    
    // Update rating
    existingRating.rating = rating;
    await existingRating.save();
    
    return res.status(200).send({
      message: 'Rating updated successfully',
      rating: existingRating
    });
  } catch (error) {
    console.log({ message: error.message });
    return res.status(500).send({ message: error.message });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const user_id = req.userId;
    
    // Check if rating exists
    const rating = await Rating.findOne({
      where: {
        store_id: storeId,
        user_id
      }
    });
    
    if (!rating) {
      return res.status(404).send({ message: 'Rating not found' });
    }
    
    // Delete rating
    await rating.destroy();
    
    return res.status(200).send({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.log({ message: error.message });
    return res.status(500).send({ message: error.message });
  }
};

export const getStoreAverageRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).send({ message: 'Store not found' });
    }
    
    // Calculate average rating
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      attributes: ['rating']
    });
    
    let totalRating = 0;
    ratings.forEach(rating => {
      totalRating += rating.rating;
    });
    
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
    
    return res.status(200).send({
      storeId,
      ratingCount: ratings.length,
      averageRating: averageRating.toFixed(1)
    });
  } catch (error) {
    console.log({ message: error.message });
    return res.status(500).send({ message: error.message });
  }
};