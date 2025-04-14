// File: /backend/src/controllers/storeOwner.controller.js
import models from '../models/index.js'; // Import the default export
const { User, Store, Rating, sequelize } = models;  // Now you can destructure User from models

export const getStoreDashboard = async (req, res) => {
  try {
    // Find stores owned by the logged-in store owner
    const stores = await Store.findAll({
      where: { owner_id: req.userId }
    });
    
    if (stores.length === 0) {
      return res.status(404).send({ message: 'No stores found for this owner' });
    }
    
    const storeIds = stores.map(store => store.id);
    
    // Get average rating for each store
    const storeData = [];
    
    for (const store of stores) {
      // Get average rating
      const avgRating = await Rating.findOne({
        where: { store_id: store.id },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'ratingCount']
        ],
        raw: true
      });
      
      // Get users who rated this store
      const ratings = await Rating.findAll({
        where: { store_id: store.id },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }],
        order: [['created_at', 'DESC']]
      });
      
      storeData.push({
        store,
        averageRating: parseFloat(avgRating.averageRating) || 0,
        ratingCount: parseInt(avgRating.ratingCount) || 0,
        ratings
      });
    }
    
    res.status(200).send(storeData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
