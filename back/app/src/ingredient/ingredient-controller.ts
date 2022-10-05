import express from 'express';
import * as ingredientDAO from './ingredient-dao';
import * as utility from '../utility';

/*
Get ingredient data.

Request Param
concept : number
*/
export const getIngredient = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);

        // type check
        if(isNaN(conceptId)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/ingredient | conceptId: ${conceptId}`);

        // response
        const result = await ingredientDAO.getIngredient(conceptId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get list of drugs containing ingredient.

Request Param
concept : number
*/
export const getIngredientContain = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);

        // type check
        if(isNaN(conceptId)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/ingredient/contain | conceptId: ${conceptId}`);

        // response
        const result = await ingredientDAO.getDrugContainingIngredient(conceptId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get ingredient quantity.

Request Param
concept : number
*/
export const getIngredientQuantity = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);

        // type check
        if(isNaN(conceptId)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/ingredient/quantity | conceptId: ${conceptId}`);

        // response
        const result = await ingredientDAO.getIngredientTotalQuantityPerPerson(conceptId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get ingredient quantity by range.

Request Param
concept : number

Request Query
start : number
end : number
*/
export const getIngredientQuantityRange = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);
        const start = Number(request.query.start);
        const end = Number(request.query.end);

        // type check
        if(isNaN(conceptId) || isNaN(start) || isNaN(end)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/ingredient/quantity/range | conceptId: ${conceptId}`);

        // response
        const result = await ingredientDAO.getPersonByIngredientQuantityRange(conceptId, start, end);
        response.json(result);

    } catch(error) { next(error); }

};
