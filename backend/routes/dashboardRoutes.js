import express from 'express';
import { getDashboard } from '../Controllers/dashboardController.js';

const router = express.Router();

router.get('/', getDashboard);

export default router;
