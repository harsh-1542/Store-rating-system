// File: /backend/src/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import models from '../models/index.js'; // Import the default export
const { User } = models;  // Now you can destructure User from models

import config from '../config/auth.js';


// Password validation function
const validatePassword = (password) => {
  // 8-16 characters with at least one uppercase letter and one special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  return passwordRegex.test(password);
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role  } = req.body;
    
    // Validate name  || name.length < 20
    if (!name  || name.length > 60) {
      return res.status(400).send({ message: 'Name must be between 20 and 60 characters' });
    }

    // Validate password
    // if (!validatePassword(password)) {
    if (!password) {
      return res.status(400).send({ 
        message: 'Password must  character' 
        // message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already in use' });
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    // Normal signup can only create user role
    // const userRole = (role === 'user') ? 'user' : role;
    const userRole = (role === 'admin' || role === 'store_owner') ? role : 'user';
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    res.status(201).send({ message: 'User registered successfully!', userId: user.id });
  } catch (error) {
    console.log({ message: error.message });
    
    res.status(500).send({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate new password
    // if (!validatePassword(newPassword)) {
    if (!newPassword && !currentPassword) {
      return res.status(400).send({ 
        message: 'Please provide current and new password' 
      });
    }

    // if (!newPassword) {
    //   return res.status(400).send({ 
    //     message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' 
    //   });
    // }
    
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Current password is incorrect' });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    // console.log({ message: error.message });
  
    
    res.status(500).send({ message: error.message });
  }
};
