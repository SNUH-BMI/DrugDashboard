import * as DB from '../db';
import * as searchSQL from './search-sql';
import atcData from '../../data/atc.json';
import drugRouteTypeData from '../../data/drug_route_type.json';
import config from '../../config/config.json';

const source_name_column: unique symbol = Symbol(config.institution_sourcename_column);

export const searchDrugExposure = (age: number[], gender: string, conditionType: string, conditionList: number[], drugType: string, drugList: string[], drugSimultaneous: boolean, atcType: string, atcList: string[], atcSimultaneous: boolean, simultaneousNumber: number): Promise<{
    drug_exposure_id: string,
    person_id: number,
    gender_source_value: string,
    age: number,
    drug_source_value: string,
    drug_concept_id: number,
    atc_cd: string,
    start_date: string,
    sig: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            let query = '';
            let andNeeded = false;

            // PEOPLE
            query += `
            WITH people AS (
                SELECT DISTINCT person_id, gender_source_value, year_of_birth
                FROM ${config.main_schema}.person
            `;

            if(gender !== undefined || conditionList !== undefined || drugList !== undefined || atcList !== undefined) query += ' WHERE ';

            // PEOPLE gender
            if(gender !== undefined) {

                query += `
                (
                    person.gender_source_value = '${gender}'
                )
                `;

                andNeeded = true;

            }

            // PEOPLE condition
            if(conditionList !== undefined) {

                if(conditionType !== 'and' && conditionType !== 'or') reject('Condition type wrong');

                if(andNeeded) query += ' AND ';

                query += '(';

                let connectionNeeded = false;

                for(const item of conditionList) {

                    if(connectionNeeded) query += ` ${conditionType} `;

                    query += `
                    person_id IN (
                        SELECT person_id
                        FROM ${config.main_schema}.condition_occurrence
                        WHERE condition_concept_id = ${item}
                    )
                    `;

                    connectionNeeded = true

                }

                query += ')';

                andNeeded = true;

            }

            // PEOPLE drug
            if(drugList !== undefined) {

                if(drugType !== 'and' && drugType !== 'or') reject('Drug type wrong');

                if(andNeeded) query += ' AND ';

                query += '(';

                let connectionNeeded = false;

                for(const item of drugList) {

                    if(connectionNeeded) query += ` ${drugType} `;

                    query += `
                    person_id IN (
                        SELECT person_id
                        FROM ${config.main_schema}.drug_exposure
                        WHERE drug_source_value = '${item}'
                    )
                    `;

                    connectionNeeded = true

                }

                query += ')';

                andNeeded = true;

            }

            // PEOPLE atc
            if(atcList !== undefined) {

                if(atcType !== 'and' && atcType !== 'or') reject('ATC type wrong');

                if(andNeeded) query += ' AND ';

                query += '(';

                let connectionNeeded = false;

                for(const item of atcList) {

                    if(connectionNeeded) query += ` ${atcType} `;

                    query += `
                    person_id IN (
                        SELECT person_id
                        FROM ${config.main_schema}.drug_exposure
                        WHERE atc_cd = '${item}'
                    )
                    `;

                    connectionNeeded = true

                }

                query += ')';

            }

            query += '),';

            query += `
                exposure_subquery AS (
                    SELECT de.drug_exposure_id, de.person_id, de.drug_concept_id, de.drug_exposure_start_date, de.drug_exposure_end_date, de.drug_source_value, de.atc_cd, de.sig, people.gender_source_value, people.year_of_birth
                    FROM ${config.main_schema}.drug_exposure AS de
                        INNER JOIN people USING (person_id)
            `;
            if(age !== undefined) {
                query += `
                    WHERE
                    visit_occurrence_id IN (
                        SELECT DISTINCT (visit_occurrence_id)
                        FROM ${config.main_exposure_cache}
                        WHERE exposure_age >=${age[0]} AND exposure_age <=${age[1]}
                    )
                `
            }
            query += '),'

            // SIMULTANEOUS NUMBER
            if(simultaneousNumber !== undefined) {

                query += `

                people_dates AS (
                    SELECT person_id, dates AS date
                    FROM ${config.dates_cache}
					WHERE person_id IN (
						SELECT DISTINCT (person_id) FROM exposure_subquery
					)
                    GROUP BY person_id, dates
                ),
                
                target_dates AS (
                    SELECT person_id, date
                    FROM (
                        SELECT person_id, date, COUNT(*) AS count
                        FROM exposure_subquery
                            INNER JOIN people_dates USING (person_id)
                        WHERE (people_dates.date <= exposure_subquery.drug_exposure_end_date AND exposure_subquery.drug_exposure_start_date <= people_dates.date)
                        GROUP BY person_id, date
                    ) AS overlapping_count
                    WHERE count >= ${simultaneousNumber}
                ),`;

            }

            andNeeded = false;

            // TARGET EXPOSURE
            query += `
            target_exposure AS (
                SELECT drug_exposure_id,
                    person_id, gender_source_value, (EXTRACT(YEAR FROM drug_exposure_start_date) - year_of_birth) AS age,
                    drug_source_value, drug_concept_id, atc_cd, TO_CHAR(drug_exposure_start_date, 'YYYY-MM-DD') AS start_date, sig
                FROM exposure_subquery
            `;

            if(simultaneousNumber !== undefined || drugList !== undefined || atcList !== undefined) query += ' WHERE ';

            // TARGET EXPOSURE drug
            if(drugList !== undefined) {

                if(andNeeded) query += ' AND ';

                query += 'drug_exposure_id IN ( WITH exposures AS ( SELECT ';

                for(let i = 0; i < drugList.length; i++) {

                    query += `d${i}.drug_exposure_id AS d${i}`;

                    if(i !== drugList.length - 1) query += ', ';

                }

                query += ' FROM people ';

                for(let i = 0; i < drugList.length; i++) {

                    query += ` INNER JOIN exposure_subquery AS d${i} USING (person_id) `;

                }

                query += ' WHERE ';

                let connectionNeeded = false;

                for(let i = 0; i < drugList.length; i++) {

                    if(connectionNeeded) query += ' AND ';

                    query += `d${i}.drug_source_value = '${drugList[i]}'`;

                    connectionNeeded = true;

                }

                // add overlap condition
                if(drugSimultaneous) {

                    for(let i = 0; i < drugList.length - 1; i++) {

                        for(let j = i + 1; j < drugList.length; j++) {

                            query += ` AND (d${i}.drug_exposure_start_date <= d${j}.drug_exposure_end_date AND d${j}.drug_exposure_start_date <= d${i}.drug_exposure_end_date) `;

                        }

                    }

                }

                query += ')';

                connectionNeeded = false;

                for(let i = 0; i < drugList.length; i++) {

                    if(connectionNeeded) query += ' UNION ';

                    query += `SELECT d${i} FROM exposures`;

                    connectionNeeded = true;

                }

                query += ')';

                andNeeded = true;

            }

            // TARGET EXPOSURE atc
            if(atcList !== undefined) {

                if(andNeeded) query += ' AND ';

                query += 'drug_exposure_id IN ( WITH exposures AS ( SELECT ';

                for(let i = 0; i < atcList.length; i++) {

                    query += `a${i}.drug_exposure_id AS a${i}`;

                    if(i !== atcList.length - 1) query += ', ';

                }

                query += ' FROM people ';

                for(let i = 0; i < atcList.length; i++) {

                    query += ` INNER JOIN exposure_subquery AS a${i} USING (person_id) `;

                }

                query += ' WHERE ';

                let connectionNeeded = false;

                for(let i = 0; i < atcList.length; i++) {

                    if(connectionNeeded) query += ' AND ';

                    query += `a${i}.atc_cd = '${atcList[i]}'`;

                    connectionNeeded = true;

                }

                // add overlap condition
                if(atcSimultaneous) {

                    for(let i = 0; i < atcList.length - 1; i++) {

                        for(let j = i + 1; j < atcList.length; j++) {

                            query += ` AND (d${i}.drug_exposure_start_date <= d${j}.drug_exposure_end_date AND d${j}.drug_exposure_start_date <= d${i}.drug_exposure_end_date) `;

                        }

                    }

                }

                query += ')';

                connectionNeeded = false;

                for(let i = 0; i < atcList.length; i++) {

                    if(connectionNeeded) query += ' UNION ';

                    query += `SELECT a${i} FROM exposures`;

                    connectionNeeded = true;

                }

                query += ')';

                andNeeded = true;

            }

            if(simultaneousNumber !== undefined) {

                if(andNeeded) query += ' AND ';

                query += `
                drug_exposure_id IN (
                    SELECT drug_exposure_id
                    FROM exposure_subquery
                        INNER JOIN target_dates USING (person_id)
                    WHERE (target_dates.date <= exposure_subquery.drug_exposure_end_date AND exposure_subquery.drug_exposure_start_date <= target_dates.date)
                )`;

            }

            query += ')';

            query += `
            SELECT *
            FROM target_exposure
            ORDER BY person_id, start_date 
            LIMIT 50000;
            `;

            const selectDrugByQuery = await DB.run(query);

            resolve(selectDrugByQuery);

        } catch(error) { reject(error); }

    });
};

export const searchDrugExposureChart = (age: number[], gender: string, conditionType: string, conditionList: number[], drugType: string, drugList: string[], drugSimultaneous: boolean, atcType: string, atcList: string[], atcSimultaneous: boolean, simultaneousNumber: number): Promise<{
    gender: string,
    age: number,
    count: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            let query = '';
            let andNeeded = false;

            // PEOPLE
            query += `
            WITH people AS (
                SELECT DISTINCT person_id, gender_source_value, year_of_birth
                FROM ${config.main_schema}.person
            `;

            if(gender !== undefined || conditionList !== undefined || drugList !== undefined || atcList !== undefined) query += ' WHERE ';

            // PEOPLE gender
            if(gender !== undefined) {

                query += `
                (
                    person.gender_source_value = '${gender}'
                )
                `;

                andNeeded = true;

            }

            // PEOPLE condition
            if(conditionList !== undefined) {

                if(conditionType !== 'and' && conditionType !== 'or') reject('Condition type wrong');

                if(andNeeded) query += ' AND ';

                query += '(';

                let connectionNeeded = false;

                for(const item of conditionList) {

                    if(connectionNeeded) query += ` ${conditionType} `;

                    query += `
                    person_id IN (
                        SELECT person_id
                        FROM ${config.main_schema}.condition_occurrence
                        WHERE condition_concept_id = ${item}
                    )
                    `;

                    connectionNeeded = true

                }

                query += ')';

                andNeeded = true;

            }

            // PEOPLE drug
            if(drugList !== undefined) {

                if(drugType !== 'and' && drugType !== 'or') reject('Drug type wrong');

                if(andNeeded) query += ' AND ';

                query += '(';

                let connectionNeeded = false;

                for(const item of drugList) {

                    if(connectionNeeded) query += ` ${drugType} `;

                    query += `
                    person_id IN (
                        SELECT person_id
                        FROM ${config.main_schema}.drug_exposure
                        WHERE drug_source_value = '${item}'
                    )
                    `;

                    connectionNeeded = true

                }

                query += ')';

                andNeeded = true;

            }

            // PEOPLE atc
            if(atcList !== undefined) {

                if(atcType !== 'and' && atcType !== 'or') reject('ATC type wrong');

                if(andNeeded) query += ' AND ';

                query += '(';

                let connectionNeeded = false;

                for(const item of atcList) {

                    if(connectionNeeded) query += ` ${atcType} `;

                    query += `
                    person_id IN (
                        SELECT person_id
                        FROM ${config.main_schema}.drug_exposure
                        WHERE atc_cd = '${item}'
                    )
                    `;

                    connectionNeeded = true

                }

                query += ')';

            }

            query += '),';

            query += `
                exposure_subquery AS (
                    SELECT de.drug_exposure_id, de.person_id, de.drug_concept_id, de.drug_exposure_start_date, de.drug_exposure_end_date, de.drug_source_value, de.atc_cd, de.sig, people.gender_source_value, people.year_of_birth
                    FROM ${config.main_schema}.drug_exposure AS de
                        INNER JOIN people USING (person_id)
            `;
            if(age !== undefined) {
                query += `
                    WHERE
                    visit_occurrence_id IN (
                        SELECT DISTINCT (visit_occurrence_id)
                        FROM ${config.main_exposure_cache}
                        WHERE exposure_age >=${age[0]} AND exposure_age <=${age[1]}
                    )
                `
            }
            query += '),'

            // SIMULTANEOUS NUMBER
            if(simultaneousNumber !== undefined) {

                query += `

                people_dates AS (
                    SELECT person_id, dates AS date
                    FROM ${config.dates_cache}
					WHERE person_id IN (
						SELECT DISTINCT (person_id) FROM exposure_subquery
					)
                    GROUP BY person_id, dates
                ),
                
                target_dates AS (
                    SELECT person_id, date
                    FROM (
                        SELECT person_id, date, COUNT(*) AS count
                        FROM exposure_subquery
                            INNER JOIN people_dates USING (person_id)
                        WHERE (people_dates.date <= exposure_subquery.drug_exposure_end_date AND exposure_subquery.drug_exposure_start_date <= people_dates.date)
                        GROUP BY person_id, date
                    ) AS overlapping_count
                    WHERE count >= ${simultaneousNumber}
                ),`;

            }

            andNeeded = false;

            // TARGET EXPOSURE
            query += `
            target_exposure AS (
                SELECT gender_source_value AS gender, (EXTRACT(YEAR FROM drug_exposure_start_date) - year_of_birth) AS age
                FROM exposure_subquery
            `;

            if(simultaneousNumber !== undefined || drugList !== undefined || atcList !== undefined) query += ' WHERE ';

            // TARGET EXPOSURE drug
            if(drugList !== undefined) {

                if(andNeeded) query += ' AND ';

                query += 'drug_exposure_id IN ( WITH exposures AS ( SELECT ';

                for(let i = 0; i < drugList.length; i++) {

                    query += `d${i}.drug_exposure_id AS d${i}`;

                    if(i !== drugList.length - 1) query += ', ';

                }

                query += ' FROM people ';

                for(let i = 0; i < drugList.length; i++) {

                    query += ` INNER JOIN exposure_subquery AS d${i} USING (person_id) `;

                }

                query += ' WHERE ';

                let connectionNeeded = false;

                for(let i = 0; i < drugList.length; i++) {

                    if(connectionNeeded) query += ' AND ';

                    query += `d${i}.drug_source_value = '${drugList[i]}'`;

                    connectionNeeded = true;

                }

                // add overlap condition
                if(drugSimultaneous) {

                    for(let i = 0; i < drugList.length - 1; i++) {

                        for(let j = i + 1; j < drugList.length; j++) {

                            query += ` AND (d${i}.drug_exposure_start_date <= d${j}.drug_exposure_end_date AND d${j}.drug_exposure_start_date <= d${i}.drug_exposure_end_date) `;

                        }

                    }

                }

                query += ')';

                connectionNeeded = false;

                for(let i = 0; i < drugList.length; i++) {

                    if(connectionNeeded) query += ' UNION ';

                    query += `SELECT d${i} FROM exposures`;

                    connectionNeeded = true;

                }

                query += ')';

                andNeeded = true;

            }

            // TARGET EXPOSURE atc
            if(atcList !== undefined) {

                if(andNeeded) query += ' AND ';

                query += 'drug_exposure_id IN ( WITH exposures AS ( SELECT ';

                for(let i = 0; i < atcList.length; i++) {

                    query += `a${i}.drug_exposure_id AS a${i}`;

                    if(i !== atcList.length - 1) query += ', ';

                }

                query += ' FROM people ';

                for(let i = 0; i < atcList.length; i++) {

                    query += ` INNER JOIN exposure_subquery AS a${i} USING (person_id) `;

                }

                query += ' WHERE ';

                let connectionNeeded = false;

                for(let i = 0; i < atcList.length; i++) {

                    if(connectionNeeded) query += ' AND ';

                    query += `a${i}.atc_cd = '${atcList[i]}'`;

                    connectionNeeded = true;

                }

                // add overlap condition
                if(atcSimultaneous) {

                    for(let i = 0; i < atcList.length - 1; i++) {

                        for(let j = i + 1; j < atcList.length; j++) {

                            query += ` AND (d${i}.drug_exposure_start_date <= d${j}.drug_exposure_end_date AND d${j}.drug_exposure_start_date <= d${i}.drug_exposure_end_date) `;

                        }

                    }

                }

                query += ')';

                connectionNeeded = false;

                for(let i = 0; i < atcList.length; i++) {

                    if(connectionNeeded) query += ' UNION ';

                    query += `SELECT a${i} FROM exposures`;

                    connectionNeeded = true;

                }

                query += ')';

                andNeeded = true;

            }

            if(simultaneousNumber !== undefined) {

                if(andNeeded) query += ' AND ';

                query += `
                drug_exposure_id IN (
                    SELECT drug_exposure_id
                    FROM exposure_subquery
                        INNER JOIN target_dates USING (person_id)
                    WHERE (target_dates.date <= exposure_subquery.drug_exposure_end_date AND exposure_subquery.drug_exposure_start_date <= target_dates.date)
                )`;

            }

            query += ')';

            query += `
            SELECT gender, age, COUNT(*)
            FROM target_exposure
            GROUP BY gender, age;
            `;

            const selectDrugByQuery = await DB.run(query);
            resolve(selectDrugByQuery);

        } catch(error) { reject(error); }

    });
};

export const searchDrug = (query: string): Promise<{
    concept_id: number,
    concept_name: string,
    vocabulary_id: string,
    [source_name_column]: string,
    source_name: string,
    use_count: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {
            const selectDrugByQuery = await DB.run(searchSQL.selectDrugByQuery(query));

            for(const item of selectDrugByQuery) {
                let data: any;

                for(const dataItem of drugRouteTypeData) {

                    if(dataItem.id === item[config.institution_sourcename_column]) data = dataItem;

                }

                if(data !== undefined) {

                    item['route'] = data.route;
                    item['type'] = data.type;

                }

            }

            resolve(selectDrugByQuery);

        } catch(error) { reject(error); }

    });
};

export const searchIngredient = (query: string): Promise<{
    concept_id: number,
    concept_name: string,
    vocabulary_id: string,
    drug_count: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectIngredientByQuery = await DB.run(searchSQL.selectIngredientByQuery(query));
            resolve(selectIngredientByQuery);

        } catch(error) { reject(error); }

    });
};

export const searchCondition = (query: string): Promise<{
    concept_id: number,
    concept_name: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {
            const selectConditionByQuery = await DB.run(searchSQL.selectConditionByQuery(query));
            resolve(selectConditionByQuery);

        } catch(error) { reject(error); }

    });
};

export const searchAtcCode = (query: string): Promise<{
    code: string,
    name: string
}[]> => {
    return new Promise((resolve, reject) => {

        try {

            const itemList = [];

            for(const item of atcData) {

                if(item.code.toLowerCase().includes(query.toLowerCase())) itemList.push(item);
                if(item.name.toLowerCase().includes(query.toLowerCase())) itemList.push(item);

            }

            resolve(itemList);

        } catch(error) { reject(error); }

    });
};

export const searchADR = (conceptId: string[], term: number): Promise<{
    person_id: number,
    measurement_concept_id: string,
    gender_source_value: string,
    age_normalized: number,
    is_in_range: boolean,
    count: number
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
        try {
            const selectNewDrugList = await DB.run(searchSQL.selectDrugADR(clist_string, term));
            resolve(selectNewDrugList);

        } catch(error) { reject(error); }

    });
};
/*
export const searchNew = (): Promise<{
    concept_id: number,
    concept_name: string,
    vocabulary_id: string,
    [source_name_column]: string,
    source_name: string,
    use_count: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {
            const selectNewDrugList = await DB.run(searchSQL.selectNewDrugTwo());
            resolve(selectNewDrugList);

        } catch(error) { reject(error); }

    });
};*/

export const searchNewExposureSpecific = (concept_id: string[]): Promise<{
    concept: string,
    year: string,
    quantity: number,
    sig: string,
    unit: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        let clist_string = `(`
        for(let i=0; i< concept_id.length; i++){
            if(i === concept_id.length-1){
                clist_string += ` ${concept_id[i]} )`

            }
            else {
                clist_string += ` ${concept_id[i]},`
            }
        }
        try {

            const selectNewDrugList = await DB.run(`
                SELECT drug_concept_id, EXTRACT(year FROM drug_exposure_start_date) AS year, quantity, sig, dose_unit_source_value
                FROM ${config.main_schema}.drug_exposure
                WHERE drug_concept_id IN ${clist_string}
            `);
            resolve(selectNewDrugList);

        } catch(error) { reject(error); }

    });
};

export const searchNewExposure = (concept_id: string[]): Promise<{
    year: string,
    count: number,
}[]> => {
    return new Promise(async (resolve, reject) => {

        let clist_string = `(`
        for(let i=0; i< concept_id.length; i++){
            if(i === concept_id.length-1){
                clist_string += ` ${concept_id[i]} )`

            }
            else {
                clist_string += ` ${concept_id[i]},`
            }
        }
        try {
            const selectNewDrugList = await DB.run(searchSQL.selectNewExposure(clist_string));
            resolve(selectNewDrugList);

        } catch(error) { reject(error); }

    });
};