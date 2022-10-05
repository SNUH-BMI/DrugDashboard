import express from 'express';
import checkRouter from './check/check-router';
import drugRouter from './drug/drug-router';
import ingredientRouter from './ingredient/ingredient-router';
import personRouter from './person/person-router';
import searchRouter from './search/search-router';

const router = express.Router();

router.use('/check', checkRouter);
router.use('/drug', drugRouter);
router.use('/ingredient', ingredientRouter);
router.use('/person', personRouter);
router.use('/search', searchRouter);

export default router;
