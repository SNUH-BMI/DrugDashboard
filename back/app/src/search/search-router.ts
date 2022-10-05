import express from 'express';
import * as searchController from './search-controller';

const router = express.Router();

// Conditional search.
router.post('/conditional', searchController.postConditional);

// Load conditional search charts.
router.post('/conditional/chart', searchController.postConditionalChart);

// Search drug.
router.get('/drug/:query', searchController.getSearch);

// Search ingredient.
router.get('/ingredient/:query', searchController.getIngredientSearch);

// Search condition.
router.get('/condition/:query', searchController.getConditionSearch);

// Search ATC code.
router.get('/atc/:query', searchController.getAtcSearch);

router.post('/adr', searchController.getADRSearch);

//router.get('/newdrug', searchController.getNewSearch);

router.post('/newdrug/exposure', searchController.getNewExposureSearch);

export default router;
