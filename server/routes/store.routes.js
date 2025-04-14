// File: /backend/src/routes/store.routes.js
import express from 'express';
import * as storeController from '../controllers/store.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// router.use(verifyToken);

router.get('/by', storeController.getStores);
router.get('/', storeController.getAllStores);
router.post('/create',verifyToken, storeController.createStore);
// router.post('/rate', storeController.rateStore);

export default router;
