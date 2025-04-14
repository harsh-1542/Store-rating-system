// File: /backend/src/controllers/admin.controller.js
import models from '../models/index.js'; // Import the default export
const { User, Store, Rating, sequelize } = models;  // Now you can destructure User from models

import bcrypt from 'bcryptjs';


export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate name
    if (!name || !password) {
      return res.status(400).send({ message: 'Name must be between 20 and 60 characters' });
    }
    
    // // Validate password
    // const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).send({ 
    //     message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' 
    //   });
    // }
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already in use' });
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).send({ message: 'User created successfully!', userId: user.id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const createStore = async (req, res) => {
  try {
    const { name, address, ownerId } = req.body;
    
    // Validate name
    if (!name || name.length > 60) {
      return res.status(400).send({ message: 'Name must be between 20 and 60 characters' });
    }
    
    // Validate address
    if (address.length > 400) {
      return res.status(400).send({ message: 'Address must be maximum 400 characters' });
    }
    
    // Check if owner exists and is a store_owner
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).send({ message: 'Owner not found' });
    }
    
    if (owner.role !== 'store_owner') {
      return res.status(400).send({ message: 'User must have store_owner role to own a store' });
    }

    // Create new store
    const store = await Store.create({
      name,
      address,
      owner_id: ownerId
    });

    res.status(201).send({ message: 'Store created successfully!', storeId: store.id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { name, email, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    if (name) {
      whereConditions.name = { [sequelize.Op.like]: `%${name}%` };
    }
    
    if (email) {
      whereConditions.email = { [sequelize.Op.like]: `%${email}%` };
    }
    
    if (role) {
      whereConditions.role = role;
    }
    
    // Validate sortBy field
    const validSortFields = ['name', 'email', 'role', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    
    // Validate sortOrder
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    
    const users = await User.findAll({
      where: whereConditions,
      order: [[sortField, order]],
      attributes: { exclude: ['password'] }
    });

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
   
    
    const users = await User.findAll({
     
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      order: [[sortField, order]],
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]
    });

    // Calculate average rating for each store
    // for (const store of stores) {
    //   const ratings = await Rating.findAll({
    //     where: { store_id: store.id },
    //     attributes: [
    //       [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
    //       [sequelize.fn('COUNT', sequelize.col('id')), 'ratingCount']
    //     ],
    //     raw: true
      // });
      
      // store.dataValues.averageRating = parseFloat(ratings[0].averageRating) || 0;
      // store.dataValues.ratingCount = parseInt(ratings[0].ratingCount) || 0;
    // }

    res.status(200).send(stores);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();
    
    res.status(200).send({
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Rating,
        as: 'ratings',
        include: [{
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
        }]
      }]
    });
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getStoreDetail = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const store = await Store.findByPk(storeId, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!store) {
      return res.status(404).send({ message: 'Store not found' });
    }
    
    // Get ratings
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    // Calculate average rating
    const avgRating = await Rating.findOne({
      where: { store_id: storeId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'ratingCount']
      ],
      raw: true
    });
    
    store.dataValues.ratings = ratings;
    store.dataValues.averageRating = parseFloat(avgRating.averageRating) || 0;
    store.dataValues.ratingCount = parseInt(avgRating.ratingCount) || 0;
    
    res.status(200).send(store);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
