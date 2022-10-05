import express from 'express';
import * as drugController from './drug-controller';

const router = express.Router();

// Get drug count.
router.get('/count/:concept/:institutionId', drugController.getCount);

// Get drug quantity.
router.get('/quantity/:concept/:institutionId', drugController.getQuantity);

// Get drug quantity by range.
router.get('/quantity/range/:concept/:institutionId', drugController.getQuantityRange);

// Get drug exposure list.
router.get('/exposure/:concept/:institutionId', drugController.getExposure);

// Get drug used together.
router.get('/together/:concept/:institutionId', drugController.getTogether);

// Get drug used together in a certain condition
router.get('/together/:concept/:institutionId/:condition', drugController.getTogetherPerCondition);

// Get drug exposure reason condition.
router.get('/condition/:concept/:institutionId', drugController.getCondition);

// Get ATC code of drug.
router.get('/purpose/:institutionId', drugController.getPurpose);

// Get exposure of the drugs that have same ATC code.
router.get('/purpose/same/:institutionId', drugController.getSamePurpose);

// Get drug data.
router.get('/:concept/:institutionId', drugController.get);

router.post('/polysearch', drugController.getIngredTogether);

router.post('/polysearch/set', drugController.getIngredTogetherSet);

export default router;
