import express from 'express';
import { loginCallOperator } from '../controllers/callOperatorController.js';

const router = express.Router();

// Route for Call Operator login
router.post('/login', loginCallOperator);

export default router;
