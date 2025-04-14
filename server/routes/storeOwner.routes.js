// File: /backend/src/routes/storeOwner.routes.js
import express from 'express';
import * as storeOwnerController from '../controllers/storeOwner.controller.js';
import { verifyToken, isStoreOwner } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, isStoreOwner);

router.get('/dashboard', storeOwnerController.getStoreDashboard);

export default router;
