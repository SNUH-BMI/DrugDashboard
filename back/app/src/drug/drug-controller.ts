import express from 'express';
import * as drugDAO from './drug-dao';
import * as utility from '../utility';

/*
Get drug data.

Request Param
concept : number
institutionId  : string
*/
export const get = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);
        const institutionId = String(request.params.institutionId);

        // type check
        if(isNaN(conceptId) || institutionId === null) {
            response.status(400).end();
            return;
        }

        const ip = request.headers['x-forwarded-for'];

        // print log
        utility.print(`GET /drug | conceptId: ${conceptId} institutionID: ${institutionId}`);

        // response
        const drugData = await drugDAO.getDrug(conceptId, institutionId);
        const drugIngredient = await drugDAO.getDrugIngredient(conceptId);

        const result = {
            data: drugData,
            ingredient: drugIngredient
        };
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get drug count.

Request Param
concept : number
institutionId  : string
*/
export const getCount = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);
        const institutionId = String(request.params.institutionId);

        // type check
        if(isNaN(conceptId) || institutionId === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/count | conceptId: ${conceptId} institutionId: ${institutionId}`);

        // response
        const drugExposureCount = await drugDAO.getDrugExposureCount(conceptId, institutionId);
        //const snuhVisitorCount = await drugDAO.getSnuhVisitorCount();

        const result = {
            drugExposureCount: drugExposureCount,
            //snuhVisitorCount : snuhVisitorCount
        };
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get drug quantity.

Request Param
concept : number
institutionId  : string
*/
export const getQuantity = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);
        const institutionId = String(request.params.institutionId);

        // type check
        if(isNaN(conceptId) || institutionId === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/quantity | conceptId: ${conceptId} institutionId: ${institutionId}`);

        // response
        const result = await drugDAO.getDrugTotalQuantityPerPerson(conceptId, institutionId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get drug quantity by range

Request Param
concept : number
institutionId  : string

Request Query
start : number
end : number
*/
export const getQuantityRange = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);
        const institutionId = String(request.params.institutionId);
        const start = Number(request.query.start);
        const end = Number(request.query.end);

        // type check
        if(isNaN(conceptId) || isNaN(start) || isNaN(end) || institutionId === undefined) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/quantity/range | conceptId: ${conceptId}`);

        // response
        const result = await drugDAO.getPersonByQuantityRange(conceptId, institutionId, start, end);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get drug exposure list.

Request Param
concept : number
institutionId  : string

Request Query
start : number (starts from 0)
number : number
*/
export const getExposure = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);
        const institutionId = String(request.params.institutionId);
        const start = Number(request.query.start);
        const number = Number(request.query.number);

        // type check
        if(isNaN(conceptId) || institutionId === null || isNaN(start) || isNaN(number)) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/exposure | conceptId: ${conceptId} institutionId: ${institutionId} start: ${start} number: ${number}`);

        // response
        const result = await drugDAO.getDrugExposure(conceptId, institutionId, start, number);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get drug used together.

Request Param
concept : number
institutionId  : string
*/
export const getTogether = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);
        const institutionId = String(request.params.institutionId);

        // type check
        if(isNaN(conceptId) || institutionId === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/together | conceptId: ${conceptId} institutionId: ${institutionId}`);

        // response
        const result = await drugDAO.getDrugUsedTogether(conceptId, institutionId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get drug used together in a certain condition

Request param
concept: number,
institutionId: string,
condition: string
*/
export const getTogetherPerCondition = async (request: express.Request, response:express.Response, next: express.NextFunction) => {

    try {

        //parse request
        const conceptId = Number(request.params.concept);
        const institutionId = String(request.params.institutionId);
        const condition = String(request.params.condition);

        // type check
        if(isNaN(conceptId) || institutionId === null || condition === null) {
            response.status(400).end();
            return;
        }

        //print log
        utility.print(`GET /drug/together/condition | conceptId: ${conceptId} institutionId: ${institutionId} condition: ${condition}`);

        //response
        const result = await drugDAO.getDrugUsedTogetherPerCondition(conceptId, institutionId, condition);
        response.json(result);

    } catch (error) { next(error); }
};

/*
Get drug exposure reason condition.

Request Param
concept : number
institutionId  : number
*/
export const getCondition = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = Number(request.params.concept);
        const institutionId = String(request.params.institutionId);

        // type check
        if(isNaN(conceptId) || institutionId === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/condition | conceptId: ${conceptId} institutionId: ${institutionId}`);

        // response
        const result = await drugDAO.getConditionNumber(conceptId, institutionId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get ATC code of drug.

Request Param
institutionId : string
*/
export const getPurpose = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const institutionId = request.params.institutionId;

        // type check
        if(institutionId === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /purpose | institutionId: ${institutionId}`);

        // response
        const result = await drugDAO.getDrugPurpose(institutionId);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get exposure of the drugs that have same ATC code.

Request Param
institutionId : string
*/
export const getSamePurpose = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const institutionId = request.params.institutionId;

        // type check
        if(institutionId === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /purpose/same | institutionId: ${institutionId}`);

        // response
        const result = await drugDAO.getDrugsWithSamePurpose(institutionId);
        response.json(result);

    } catch(error) { next(error); }

};

export const getIngredTogether = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = request.body.params.concept_id;
        // type check
        if(conceptId === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /polysearch | conceptId: ${conceptId}`);
        //const visit_occur_list = await drugDAO.getVisitOccurrenceId(conceptId);

        const result = await drugDAO.getIngredientUsedTogether(conceptId);
        response.send(result);

    } catch(error) { next(error); }

};

export const getIngredTogetherSet = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const conceptId = request.body.params.concept_id;
        const setNum = request.body.params.set_num;
        // type check
        if(conceptId === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /polysearch/set | coneptId: ${conceptId}`);
        const result = await drugDAO.getIngredientSet(conceptId, setNum);
        response.send(result);
    } catch(error) { next(error); }

};
