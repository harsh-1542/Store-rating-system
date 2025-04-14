// File: /backend/src/middlewares/auth.js
import jwt from 'jsonwebtoken';

import models from '../models/index.js'; // Import the default export
const { User } = models;  // Now you can destructure User from models

import config from '../config/auth.js';

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
      return res.status(403).send({ message: 'No token provided!' });
    }

    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(tokenString, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Unauthorized!' });
      }

      req.userId = decoded.id;
      console.log('Token verified:', decoded.id);
      next();
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).send({ message: 'Failed to authenticate token.' });
  }
};


const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.role !== 'admin') {
      console.log("error", user.role);
      
      return res.status(403).send({ message: 'Require Admin Role!' });
    }
    next();
  } catch (error) {
    console.log("error", error);
    
    res.status(500).send({ message: error.message });
  }
};

const isStoreOwner = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.role !== 'store_owner') {
      return res.status(403).send({ message: 'Require Store Owner Role!' });
    }
    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export  {
  verifyToken,
  isAdmin,
  isStoreOwner
};
