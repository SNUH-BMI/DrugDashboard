import express from 'express';
import * as ingredientController from './ingredient-controller';

const router = express.Router();

// Get list of drugs containing ingredient.
router.get('/contain/:concept', ingredientController.getIngredientContain);

// Get drug quantity by range.
router.get('/quantity/range/:concept', ingredientController.getIngredientQuantityRange);

// Get ingredient quantity.
router.get('/quantity/:concept', ingredientController.getIngredientQuantity);

// Get ingredient data.
router.get('/:concept', ingredientController.getIngredient);

export default router;
