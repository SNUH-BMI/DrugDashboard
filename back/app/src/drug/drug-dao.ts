import * as DB from '../db';
import * as drugSQL from './drug-sql';
import atcData from '../../data/atc.json';
import drugRouteType from '../../data/drug_route_type.json';
import config from '../../config/config.json';

const source_name_column: unique symbol = Symbol(config.institution_sourcename_column);

export const getDrug = (conceptId: number, institutionId: string): Promise<{
    concept_id: number,
    concept_name: string,
    domain_id: string,
    vocabulary_id: string,
    concept_class_id: string,
    concept_code: string,
    [source_name_column]: string,
    source_name: string,
    unit: string
}> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectDrug = await DB.run(drugSQL.selectDrug(conceptId, institutionId));
            resolve(selectDrug[0]);

        } catch(error) { reject(error);}

    });
};

export const getDrugExposureCount = (conceptId: number, institutionId: string): Promise<{
    gender: string,
    age: number,
    r_cnt: string,
    p_cnt: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectDrugExposureCount = await DB.run(drugSQL.selectDrugExposureCount(conceptId, institutionId));
            resolve(selectDrugExposureCount);

        } catch(error) { reject(error); }

    });
};

export const getDrugExposure = (conceptId: number, institutionId: string, start: number, number: number): Promise<{
    drug_exposure_id: string,
    person_id: number,
    provider_id: number,
    sig: string,
    drug_exposure_start_date: string,
    drug_exposure_end_date: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectDrugExposure = await DB.run(drugSQL.selectDrugExposure(conceptId, institutionId, start, number));
            resolve(selectDrugExposure);

        } catch(error) { reject(error); }

    });
};

export const getDrugUsedTogether = (conceptId: number, institutionId: string): Promise<{
    drugAllList: any[],
    drugIVList: object[]
}> => {
    return new Promise(async (resolve, reject) => {

        try {
    
            const drugUsedTogether = await DB.run(drugSQL.selectDrugUsedTogether(conceptId, institutionId));

            const IVList = drugRouteType.filter(i=>i.type === '수액').map(i=>i.id); 
            const drugTypeIV: object[] = [];
            
            for(const drug of drugUsedTogether.filter(i => i.route_source_value === '주사')) {
                if(IVList.includes(drug.drug_source_value))
                    drugTypeIV.push(drug.drug_source_value);
            }

            const result = {
                drugAllList: drugUsedTogether,
                drugIVList: drugTypeIV
            };

            resolve(result);

        } catch(error) { reject(error); }

    });
};

export const getDrugUsedTogetherPerCondition = (conceptId: number, institutionId: string, condition: string): Promise<{
    drug_concept_id: number,
    drug_source_value: string,
    concept_name: string,
    count: number
}[]> => {
    return new Promise(async (resolve, reject) => {
        try {

            const selectDrugUsedTogetherPerCondition = await DB.run(drugSQL.selectDrugUsedTogetherPerCondition(conceptId, institutionId, condition));
            resolve(selectDrugUsedTogetherPerCondition);

        }catch(error) {reject(error);}
    });

};

export const getDrugIngredient = (conceptId: number): Promise<{
    concept_id: number,
    name: string,
    [source_name_column]: string,
    amount: string,
    unit: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectDrugIngredient = await DB.run(drugSQL.selectDrugIngredient(conceptId));
            resolve(selectDrugIngredient);

        } catch(error) { reject(error); }

    });
};

export const getDrugTotalQuantityPerPerson = (conceptId: number, institutionId: string): Promise<{
    person_id: number,
    quantity: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectDrugTotalQuantityPerPerson = await DB.run(drugSQL.selectDrugTotalQuantityPerPerson(conceptId, institutionId));
            resolve(selectDrugTotalQuantityPerPerson);

        } catch(error) { reject(error); }

    });
};

export const getPersonByQuantityRange = (conceptId: number, institutionId: string, start: number, end: number): Promise<{
    person_id: number,
    year_of_birth: number,
    month_of_birth: number,
    gender_source_value: string,
    quantity: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectPersonByQuantityRange = await DB.run(drugSQL.selectPersonByQuantityRange(conceptId, institutionId, start, end));
            resolve(selectPersonByQuantityRange);

        } catch(error) { reject(error); }

    });
};

export const getConditionNumber = (conceptId: number, institutionId: string): Promise<{
    concept_name: string,
    number: number
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectNumberOfCondition = await DB.run(drugSQL.selectNumberOfCondition(conceptId, institutionId));
            resolve(selectNumberOfCondition);

        } catch(error) { reject(error); }

    });
};

export const getDrugPurpose = (institutionId: string): Promise<{
    code: string,
    name: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const itemList = [];

            const selectPurpose = await DB.run(drugSQL.selectPurpose(institutionId));

            for(const selected of selectPurpose) {

                const atcCode: string = selected.atc_cd;

                for(const item of atcData) {

                    if(item.code === atcCode) {
                        itemList.push(item);
                        break;
                    }

                }

            }

            resolve(itemList);

        } catch(error) { reject(error); }

    });
};

export const getDrugsWithSamePurpose = (institutionId: string): Promise<{
    conceptId: string,
    institutionId: string,
    exposureList: Array<any>
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const drugList = [];
            const result = [];

            const selectDrugsWithSamePurpose = await DB.run(drugSQL.selectDrugsWithSamePurpose(institutionId));

            for(const item of selectDrugsWithSamePurpose) {

                drugList.push({
                    conceptId: item.drug_concept_id,
                    institutionId: item.drug_source_value
                });

            }

            for(const drug of drugList) {

                const exposureList = await DB.run(drugSQL.selectDrugExposureTotalCount(drug.institutionId));

                result.push({
                    conceptId: drug.conceptId,
                    institutionId: drug.institutionId,
                    exposureList: exposureList
                });

            }

            resolve(result);

        } catch(error) { reject(error); }

    });
};

export const getVisitOccurrenceId = (conceptId: string[]) : Promise<{
    visit_occurrence_id: string,
}[]> => {
    return new Promise(async (resolve, reject) => {
        let sql_string = `SELECT DISTINCT visit_occurrence_id from public.drug_dashboard_cache_final WHERE drug_concept_id IN `
        let clist_string = `(`
        for(let i=0; i< conceptId.length; i++){
            if(i === conceptId.length-1){
                clist_string += ` ${conceptId[i]} );`

            }
            else {
                clist_string += ` ${conceptId[i]},`
            }
        }
        sql_string += clist_string;
        
        try {
            const selectIngredientUsedTogether = await DB.run(sql_string);
            resolve(selectIngredientUsedTogether);
        } catch (error) {reject(error);}
    })
};

export const getIngredientUsedTogether = (conceptId: string[]) : Promise<{
    visit_occurrence_id: string,
    visit_concept_id: string,
    drug_exposure_start_date: string,
    exposure_age: number,
    drug_concept_id: string,
    drug_count: number,
    count: string,
}[]> => {
    return new Promise(async (resolve, reject) => {


        let sql_string = `SELECT ddcf.drug_concept_id, ddcf.visit_concept_id, sum(ddcf.count) FROM public.drug_dashboard_cache_final AS ddcf, (SELECT visit_occurrence_id, drug_exposure_start_date FROM public.drug_dashboard_cache_final WHERE drug_concept_id IN `
        let clist_string = `(`
        for(let i=0; i< conceptId.length; i++){
            if(i === conceptId.length-1){
                clist_string += ` ${conceptId[i]} )`

            }
            else {
                clist_string += ` ${conceptId[i]},`
            }
        }
        sql_string += clist_string + ` GROUP BY visit_occurrence_id, drug_exposure_start_date) As b WHERE drug_concept_id NOT IN ${clist_string} AND ddcf.visit_occurrence_id = b.visit_occurrence_id AND ddcf.drug_exposure_start_date = b.drug_exposure_start_date GROUP BY ddcf.drug_concept_id, ddcf.visit_concept_id`

        try {
            const selectIngredientUsedTogether = await DB.run(sql_string);

            resolve(selectIngredientUsedTogether);
        } catch (error) {reject(error);}
    })
};

export const getIngredientSet = (conceptId: string[], setNum: number) : Promise<{
    visit_occurrence_id: string,
    visit_concept_id: string,
    drug_exposure_start_date: string,
    exposure_age: number,
    drug_concept_id: string,
    drug_count: number,
    count: string,
}[]> => {
    return new Promise(async (resolve, reject) => {

        let clist_string = `(`
        for(let i=0; i< conceptId.length; i++){
            if(i === conceptId.length-1){
                clist_string += ` ${conceptId[i]} )`

            }
            else {
                clist_string += ` ${conceptId[i]},`
            }
        }
        let sql_string = `SELECT dd.visit_occurrence_id, dd.drug_exposure_start_date, dd.exposure_age, dd.drug_concept_id, dd.count FROM ${config.main_exposure_cache_recent5} AS dd, 
        (SELECT visit_occurrence_id, drug_exposure_start_date FROM ${config.main_exposure_cache_recent5} WHERE drug_concept_id IN `
        sql_string += clist_string + `GROUP BY visit_occurrence_id, drug_exposure_start_date) AS b 
        WHERE dd.drug_count = ${setNum} AND dd.visit_occurrence_id = b.visit_occurrence_id AND dd.drug_exposure_start_date = b.drug_exposure_start_date 
        GROUP BY dd.visit_occurrence_id, dd.drug_exposure_start_date, dd.exposure_age, dd.drug_concept_id, dd.count ORDER BY dd.visit_occurrence_id;`;
        try {
            const selectIngredientUsedTogether = await DB.run(sql_string);
            resolve(selectIngredientUsedTogether);
        } catch (error) {reject(error);}
    })
};
