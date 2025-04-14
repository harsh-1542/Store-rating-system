// File: /backend/src/controllers/store.controller.js
import models from '../models/index.js'; // Import the default export
const { User, Store, Rating, sequelize } = models;  // Now you can destructure User from models

// Create store controller
export const createStore = async (req, res) => {
  try {
    const { name, address } = req.body;

    // Check if the user exists
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Check if the user has the correct role
    if (user.role !== 'store_owner') {
      return res.status(403).send({ message: 'Only store owners can create stores' });
    }

    // Check if user already owns a store
    const existingStore = await Store.findOne({
      where: { owner_id: req.userId }
    });

    if (existingStore) {
      return res.status(400).send({ message: 'You already own a store' });
    }

    // Create the store
    const newStore = await Store.create({
      name,
      address,
      
      owner_id: req.userId
    });

    res.status(201).send(newStore);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    if (name) {
      whereConditions.name = { [sequelize.Op.like]: `%${name}%` };
    }
    
    if (address) {
      whereConditions.address = { [sequelize.Op.like]: `%${address}%` };
    }
    
    // Validate sortBy field
    const validSortFields = ['name', 'address', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    
    // Validate sortOrder
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    
    const stores = await Store.findAll({
      where: whereConditions,
      order: [[sortField, order]]
    });

    // Calculate average rating and user's rating for each store
    for (const store of stores) {
      // Get average rating
      const avgRating = await Rating.findOne({
        where: { store_id: store.id },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
        ],
        raw: true
      });
      
      // Get user's rating if exists
      const userRating = await Rating.findOne({
        where: { 
          store_id: store.id,
          // user_id: req.userId
        }
      });
      
      store.dataValues.averageRating = parseFloat(avgRating.averageRating) || 0;
      store.dataValues.userRating = userRating ? userRating.rating : null;
    }

    res.status(200).send(stores);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


export const getAllStores = async (req, res) => {
  try {
    
    const stores = await Store.findAll({
      
    });


    res.status(200).send(stores);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const rateStore = async (req, res) => {
  try {
    // const { storeId } = req.params;
    const { storeId,rating } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).send({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).send({ message: 'Store not found' });
    }
    
    // Check if user has already rated this store
    const existingRating = await Rating.findOne({
      where: {
        store_id: storeId,
        user_id: req.userId
      }
    });
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
      res.status(200).send({ message: 'Rating updated successfully' });
    } else {
      // Create new rating
      await Rating.create({
        store_id: storeId,
        user_id: req.userId,
        rating
      });
      res.status(201).send({ message: 'Rating submitted successfully' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
