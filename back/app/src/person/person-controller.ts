import express from 'express';
import * as personDAO from './person-dao';
import * as drugDAO from '../drug/drug-dao';
import * as utility from '../utility';

/*
Get person data.

Request Param
person : number
*/
export const get = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const personId = Number(request.params.person);

        // type check
        if(isNaN(personId)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /person | personId: ${personId}`);

        // response
        const result = await personDAO.getPerson(personId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get person's drug exposure list.

Request Param
person : number
*/
export const getDrugExposure = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const personId = Number(request.params.person);

        // type check
        if(isNaN(personId)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /person/drug/exposure | personId: ${personId}`);

        // response
        const drugExposureList = await personDAO.getDrugExposure(personId);

        const drugList: number[] = [];
        const ingredientList: object[] = [];

        for(const drug of drugExposureList) {

            const drugId = drug.drug_concept_id;

            if(!drugList.includes(drugId)) {

                drugList.push(drugId);

                // get ingredients of each drug
                const ingredients = await drugDAO.getDrugIngredient(drugId);

                for(const ingredient of ingredients) {

                    const ingredientId = ingredient.concept_id;

                    const object = {
                        drug: drugId,
                        ingredient: ingredientId
                    };

                    if(!ingredientList.includes(object)) ingredientList.push(object);

                }

            }

        }

        const result = {
            exposureList: drugExposureList,
            ingredientList: ingredientList
        };
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get person's condition list.

Request Param
person : number
*/
export const getCondition = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const personId = Number(request.params.person);

        // type check
        if(isNaN(personId)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /person/condition | personId: ${personId}`);

        // response
        const result = await personDAO.getCondition(personId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get person's visit list.

Request Param
person : number

Request Query
condition : string or string[]
*/
export const getVisit = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const personId = Number(request.params.person);
        let condition = request.query.condition;

        // type check
        if(isNaN(personId)) {
            response.status(400).end();
            return;
        }

        if(typeof condition !== 'string') {

            if(condition instanceof Array) condition = condition as Array<string>;
            else {
                response.status(400).end();
                return;
            }

        }

        // print log
        utility.print(`GET /person/visit | personId: ${personId}`);

        // response
        const result = await personDAO.getVisit(personId, condition);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get person's drug era.

Request Param
person : number
*/
export const getEra = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const personId = Number(request.params.person);

        // type check
        if(isNaN(personId)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /person/era | personId: ${personId}`);

        // response
        const result = await personDAO.getDrugEra(personId);
        response.json(result);

    } catch(error) { next(error); }

};
