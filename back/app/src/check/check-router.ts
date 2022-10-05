import express from 'express';
import * as checkController from './check-controller';

const router = express.Router();

// Check backend server.
router.get('/backend', checkController.getBackend);

// Check database.
router.get('/database', checkController.getDatabase);

export default router;
