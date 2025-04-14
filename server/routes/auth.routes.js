// File: /backend/src/routes/auth.routes.js
import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.put('/update-password', verifyToken, authController.updatePassword);

export default router;
