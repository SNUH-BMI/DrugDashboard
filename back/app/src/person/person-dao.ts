import * as DB from '../db';
import * as personSQL from './person-sql';

export const getPerson = (personId: number): Promise<{
    year_of_birth: number,
    month_of_birth: number,
    gender_source_value: string,
    city: string,
    state: string,
    location_source_value: string
}> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectPersonById = await DB.run(personSQL.selectPersonById(personId));
            resolve(selectPersonById[0]);

        } catch(error) { reject(error); }

    });
};

export const getDrugExposure = (personId: number): Promise<{
    drug_exposure_id: string,
    start_date: string,
    days_supply: number,
    quantity: string,
    dose_unit_source_value: string,
    sig: string,
    provider_id: number,
    route_source_value: string,
    drug_concept_id: number,
    drug_source_value: string,
    drug_name: string,
    condition_concept_id: number,
    condition_name: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectDrugExposure = await DB.run(personSQL.selectDrugExposure(personId));
            resolve(selectDrugExposure);

        } catch(error) { reject(error); }

    });
};

export const getCondition = (personId: number): Promise<{
    concept_id: number
    concept_name: string,
    count: number
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectCondition = await DB.run(personSQL.selectCondition(personId));
            resolve(selectCondition);

        } catch(error) { reject(error); }

    });
};

export const getVisit = (personId: number, condition: string|string[]): Promise<{
    visit_occurrence_id: number,
    visit_concept_id: number,
    visit_start_date: string,
    visit_end_date: string,
    visit_type_concept_id: number,
    provider_id: number,
    care_site_id: number,
    visit_source_value: string,
    condition_concept_id: number
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            let conditionQuery: string;

            if(typeof condition === 'string') {

                conditionQuery = `condition_concept_id = ${condition}`;

            } else { // condition is array of string

                conditionQuery = '( ';

                for(const item of condition) {
                    conditionQuery += `condition_concept_id = ${item}`
                    conditionQuery += ' OR '
                }

                conditionQuery = conditionQuery.slice(0, -4);
                conditionQuery += ' )';

            }

            const selectVisitByCondition = await DB.run(personSQL.selectVisitByCondition(personId, conditionQuery));
            resolve(selectVisitByCondition);

        } catch(error) { reject(error); }

    });
};

export const getDrugEra = (personId: number): Promise<{
    drug_concept_id: number,
    concept_name: string,
    drug_era_start_date: string,
    drug_era_end_date: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectDrugEra = await DB.run(personSQL.selectDrugEra(personId));
            resolve(selectDrugEra);

        } catch(error) { reject(error); }

    });
};
