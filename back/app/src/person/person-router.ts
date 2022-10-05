import express from 'express';
import * as personController from './person-controller';

const router = express.Router();

// Get person data.
router.get('/:person', personController.get);

// Get person's drug exposure list.
router.get('/drug/exposure/:person', personController.getDrugExposure);

// Get person's condition list.
router.get('/condition/:person', personController.getCondition);

// Get person's visit list.
router.get('/visit/:person', personController.getVisit);

// Get person's drug era.
router.get('/era/:person', personController.getEra);

export default router;
