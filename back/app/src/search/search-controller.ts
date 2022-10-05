import express from 'express';
import * as searchDAO from './search-dao';
import * as utility from '../utility';
import config from '../../config/config.json';

const groupBy = require('json-groupby');
/*
Conditional search.
*/
export const postConditional = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const age = request.body.age;
        const gender = request.body.gender;
        const conditionType = request.body.conditionType;
        const conditionList = request.body.conditionList;
        const drugType = request.body.drugType;
        const drugList = request.body.drugList;
        const drugSimultaneous = request.body.drugSimultaneous;
        const atcType = request.body.atcType;
        const atcList = request.body.atcList;
        const atcSimultaneous = request.body.atcSimultaneous;
        const simultaneousNumber = request.body.simultaneousNumber;

        // print log
        utility.print(`POST /search/conditional`);
        request.setTimeout(360000 * 12);

        // response
        const result = await searchDAO.searchDrugExposure(age, gender, conditionType, conditionList, drugType, drugList, drugSimultaneous, atcType, atcList, atcSimultaneous, simultaneousNumber);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Load conditional search charts.
*/
export const postConditionalChart = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const age = request.body.age;
        const gender = request.body.gender;
        const conditionType = request.body.conditionType;
        const conditionList = request.body.conditionList;
        const drugType = request.body.drugType;
        const drugList = request.body.drugList;
        const drugSimultaneous = request.body.drugSimultaneous;
        const atcType = request.body.atcType;
        const atcList = request.body.atcList;
        const atcSimultaneous = request.body.atcSimultaneous;
        const simultaneousNumber = request.body.simultaneousNumber;

        // print log
        utility.print(`POST /search/conditional/chart`);
        request.setTimeout(360000 * 12);
        
        // response
        const result = await searchDAO.searchDrugExposureChart(age, gender, conditionType, conditionList, drugType, drugList, drugSimultaneous, atcType, atcList, atcSimultaneous, simultaneousNumber);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Search drug.

Request Param
query : string
*/
export const getSearch = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {
        // parse request
        const query = request.params.query;
        // type check
        if(query === null) {
            response.status(400).end();
            return;
        }

        const ip = request.headers['x-forwarded-for'];


        // print log
        utility.print(`GET /drug/search | query: ${query}`);

        // response
        const result = await searchDAO.searchDrug(query);

        response.json(result);

    } catch(error) { next(error); }

};

/*
Search ingredient.

Request Param
query : string
*/
export const getIngredientSearch = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const query = request.params.query;

        // type check
        if(query === null) {
            response.status(400).end();
            return;
        }

        const ip = request.headers['x-forwarded-for'];

        // print log
        utility.print(`GET /drug/ingredient/search | query: ${query}`);

        // response
        const result = await searchDAO.searchIngredient(query);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Search condition.

Request Param
query : string
*/
export const getConditionSearch = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const query = request.params.query;

        // type check
        if(query === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/condition/search | query: ${query}`);

        // response
        const result = await searchDAO.searchCondition(query);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Search ATC code.

Request Param
query : string
*/
export const getAtcSearch = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const query = request.params.query;

        // type check
        if(query === null) {
            response.status(400).end();
            return;
        }

        // print log
        utility.print(`GET /drug/atc/search | query: ${query}`);

        // response
        const result = await searchDAO.searchAtcCode(query);
        response.json(result);

    } catch(error) { next(error); }

};

export const getADRSearch = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {
        const conceptId = request.body.params.concept_id;
        const term = request.body.params.term;
        // print log
        utility.print(`GET /adr/${term}`);

        // response
        const result = await searchDAO.searchADR(conceptId, term);

        let in_range = result.filter((data) => (data.is_in_range===true));
        let oo_range = result.filter((data) => (data.is_in_range===false));
        let oo_grouped_by_concept = groupBy(oo_range, ['measurement_concept_id']);
        let in_grouped_by_concept = groupBy(in_range, ['measurement_concept_id']);
        let oo_grouped_by_conceptperson = groupBy(oo_range, ['measurement_concept_id', 'person_id']);
        let oo_grouped_by_conceptgenderperson = groupBy(oo_range, ['measurement_concept_id', 'gender_source_value', 'person_id']);
        let in_grouped_by_conceptperson = groupBy(in_range, ['measurement_concept_id', 'person_id']);
        
        let oo_grouped_by_conceptageperson = groupBy(oo_range, ['measurement_concept_id', 'age_normalized', 'person_id']);

        let age_final:any = {};
        age_final[config.ALT_code] = {'0': 0, '10': 0,'20': 0,'30': 0,'40': 0,'50': 0, '60': 0, '70': 0, '80': 0, '90': 0, '100': 0};
        age_final[config.AST_code] = {'0': 0, '10': 0,'20': 0,'30': 0,'40': 0,'50': 0, '60': 0, '70': 0, '80': 0, '90': 0, '100': 0};
        age_final[config.Cr_code] = {'0': 0, '10': 0,'20': 0,'30': 0,'40': 0,'50': 0, '60': 0, '70': 0, '80': 0, '90': 0, '100': 0};
        age_final[config.INR_code] = {'0': 0, '10': 0,'20': 0,'30': 0,'40': 0,'50': 0, '60': 0, '70': 0, '80': 0, '90': 0, '100': 0};
        age_final[config.TBil_code] = {'0': 0, '10': 0,'20': 0,'30': 0,'40': 0,'50': 0, '60': 0, '70': 0, '80': 0, '90': 0, '100': 0};
        
        Object.keys(oo_grouped_by_conceptageperson[config.ALT_code]).map((d) => {if(parseInt(d) >= 100) age_final[config.ALT_code]['100'] += Object.keys(oo_grouped_by_conceptageperson[config.ALT_code][d]).length; else age_final[config.ALT_code][d] += Object.keys(oo_grouped_by_conceptageperson[config.ALT_code][d]).length});
        Object.keys(oo_grouped_by_conceptageperson[config.AST_code]).map((d) => {if(parseInt(d) >= 100) age_final[config.AST_code]['100'] += Object.keys(oo_grouped_by_conceptageperson[config.AST_code][d]).length; else age_final[config.AST_code][d] += Object.keys(oo_grouped_by_conceptageperson[config.AST_code][d]).length});
        Object.keys(oo_grouped_by_conceptageperson[config.Cr_code]).map((d) => {if(parseInt(d) >= 100) age_final[config.Cr_code]['100'] += Object.keys(oo_grouped_by_conceptageperson[config.Cr_code][d]).length; else age_final[config.Cr_code][d] += Object.keys(oo_grouped_by_conceptageperson[config.Cr_code][d]).length});
        Object.keys(oo_grouped_by_conceptageperson[config.INR_code]).map((d) => {if(parseInt(d) >= 100) age_final[config.INR_code]['100'] += Object.keys(oo_grouped_by_conceptageperson[config.INR_code][d]).length; else age_final[config.INR_code][d] += Object.keys(oo_grouped_by_conceptageperson[config.INR_code][d]).length});
        Object.keys(oo_grouped_by_conceptageperson[config.TBil_code]).map((d) => {if(parseInt(d) >= 100) age_final[config.TBil_code]['100'] += Object.keys(oo_grouped_by_conceptageperson[config.TBil_code][d]).length; else age_final[config.TBil_code][d] += Object.keys(oo_grouped_by_conceptageperson[config.TBil_code][d]).length});
 
        let agetotal_final:any = {};
        agetotal_final[config.ALT_code] = Object.keys(age_final[config.ALT_code]).reduce((acc:any, cur:any, idx:any) => {return acc+ age_final[config.ALT_code][cur]}, 0);
        agetotal_final[config.AST_code] = Object.keys(age_final[config.AST_code]).reduce((acc:any, cur:any, idx:any) => {return acc+ age_final[config.AST_code][cur]}, 0);
        agetotal_final[config.Cr_code] = Object.keys(age_final[config.Cr_code]).reduce((acc:any, cur:any, idx:any) => {return acc+ age_final[config.Cr_code][cur]}, 0);
        agetotal_final[config.INR_code] = Object.keys(age_final[config.INR_code]).reduce((acc:any, cur:any, idx:any) => {return acc+ age_final[config.INR_code][cur]}, 0);
        agetotal_final[config.TBil_code] = Object.keys(age_final[config.TBil_code]).reduce((acc:any, cur:any, idx:any) => {return acc+ age_final[config.TBil_code][cur]}, 0);
        
        let final_result = {
            "ALT_oo":oo_grouped_by_concept[config.ALT_code].length,
            "AST_oo":oo_grouped_by_concept[config.AST_code].length,
            "Cr_oo":oo_grouped_by_concept[config.Cr_code].length,
            "INR_oo":oo_grouped_by_concept[config.INR_code].length,
            "TBil_oo":oo_grouped_by_concept[config.TBil_code].length,
            "ALT_in":in_grouped_by_concept[config.ALT_code].length,
            "AST_in":in_grouped_by_concept[config.AST_code].length,
            "Cr_in":in_grouped_by_concept[config.Cr_code].length,
            "INR_in":in_grouped_by_concept[config.INR_code].length,
            "TBil_in":in_grouped_by_concept[config.TBil_code].length,
            "ALT_p_oo":Object.keys(oo_grouped_by_conceptperson[config.ALT_code]).length,
            "ALT_p_oo_male":Object.keys(oo_grouped_by_conceptgenderperson[config.ALT_code]["M"]).length,
            "ALT_p_oo_female":Object.keys(oo_grouped_by_conceptgenderperson[config.ALT_code]["F"]).length,
            "AST_p_oo":Object.keys(oo_grouped_by_conceptperson[config.AST_code]).length,
            "AST_p_oo_male":Object.keys(oo_grouped_by_conceptgenderperson[config.AST_code]["M"]).length,
            "AST_p_oo_female":Object.keys(oo_grouped_by_conceptgenderperson[config.AST_code]["F"]).length,
            "Cr_p_oo":Object.keys(oo_grouped_by_conceptperson[config.Cr_code]).length,
            "Cr_p_oo_male":Object.keys(oo_grouped_by_conceptgenderperson[config.Cr_code]["M"]).length,
            "Cr_p_oo_female":Object.keys(oo_grouped_by_conceptgenderperson[config.Cr_code]["F"]).length,
            "INR_p_oo":Object.keys(oo_grouped_by_conceptperson[config.INR_code]).length,
            "INR_p_oo_male":Object.keys(oo_grouped_by_conceptgenderperson[config.INR_code]["M"]).length,
            "INR_p_oo_female":Object.keys(oo_grouped_by_conceptgenderperson[config.INR_code]["F"]).length,
            "TBil_p_oo":Object.keys(oo_grouped_by_conceptperson[config.TBil_code]).length,
            "TBil_p_oo_male":Object.keys(oo_grouped_by_conceptgenderperson[config.TBil_code]["M"]).length,
            "TBil_p_oo_female":Object.keys(oo_grouped_by_conceptgenderperson[config.TBil_code]["F"]).length,
            "ALT_p_in":Object.keys(in_grouped_by_conceptperson[config.ALT_code]).length,
            "AST_p_in":Object.keys(in_grouped_by_conceptperson[config.AST_code]).length,
            "Cr_p_in":Object.keys(in_grouped_by_conceptperson[config.Cr_code]).length,
            "INR_p_in":Object.keys(in_grouped_by_conceptperson[config.INR_code]).length,
            "TBil_p_in":Object.keys(in_grouped_by_conceptperson[config.TBil_code]).length,
            "oo_by_conceptage": {"age_each": age_final, "age_total": agetotal_final}
        }
        response.json(final_result);

    } catch(error) { next(error); }

};

export const getNewExposureSearch = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {
        const conceptId = request.body.params.concept_id;
        const hcq: {[concept:string] : number} = {'40184085': 200, '42935544': 300, '42935564': 150, '42935569': 100};
        const lopirito: {[ingred:string] : number} = {'lopinavir': 200, 'ritonavir': 50};

        // print log
        utility.print(`GET /newdrug/exposure`);
        let result;
        let final_result: {[year:string] : number} = {};
        let final_lopirito_result: {[key:string]: {[year:string] : number}} = {'lopinavir': {}, 'ritonavir': {}};

        // response
        // hydroxychloroquine & lopinavir/ritonavir
        if(conceptId.includes('40184084') || conceptId.includes('42935544') || conceptId.includes('42935564') || conceptId.includes('42935569')){
            result = await searchDAO.searchNewExposureSpecific(conceptId);
            let result_by_year = groupBy(result, ['year']);
            Object.keys(result_by_year).forEach(function(key) {
                final_result[key] = result_by_year[key].reduce((acc: number, cur: any) =>{
                    if(cur.unit == 'tab') return acc + (hcq[cur.concept] * Number(cur.quantity));
                    else return acc + Number(cur.quantity)
                }, 0);
            });
            response.json(final_result);
        }
        else if(conceptId.includes('19122186')){
            result = await searchDAO.searchNewExposureSpecific(conceptId);
            let result_by_year = groupBy(result, ['year']);
            Object.keys(result_by_year).forEach(function(key) {
                let tmp;
                tmp = result_by_year[key].reduce((acc: any, cur: any) =>{
                    acc['lopinavir'] += Number(cur.quantity)*lopirito['lopinavir'];
                    acc['ritonavir'] += Number(cur.quantity)*lopirito['ritonavir'];
                    return {'lopinavir': acc['lopinavir']+Number(cur.quantity)*lopirito['lopinavir'], 'ritonavir': acc['ritonavir']+Number(cur.quantity)*lopirito['ritonavir']};
                }, {'lopinavir':0, 'ritonavir': 0});
                final_lopirito_result['lopinavir'][key] = tmp['lopinavir'];
                final_lopirito_result['ritonavir'][key] = tmp['ritonavir'];
            });
            response.json(final_lopirito_result);
        }
        else {
            result = await searchDAO.searchNewExposure(conceptId);
            response.json(result);
        }

    } catch(error) { next(error); }

};