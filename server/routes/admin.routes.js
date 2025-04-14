// File: /backend/src/routes/admin.routes.js
import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.post('/users', adminController.createUser);
router.post('/stores', adminController.createStore);
router.get('/users', adminController.getUsers);
router.get('/stores', adminController.getStores);
router.get('/dashboard', adminController.getDashboardStats);
router.get('/users/:userId', adminController.getUserDetail);
router.get('/stores/:storeId', adminController.getStoreDetail);

export default router;
