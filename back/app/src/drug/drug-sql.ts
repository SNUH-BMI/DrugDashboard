import config from '../../config/config.json';

export const selectDrug = (conceptId: number, institutionId: string): string =>
    `
    SELECT concept.concept_id, concept.concept_name, concept.domain_id, concept.vocabulary_id, concept.concept_class_id, concept.concept_code, 
        source_to_concept_map.${config.institution_sourcename_column}, source_to_concept_map.source_name,
        ${config.drugunit_cache}.dose_unit_source_value
    FROM ${config.main_schema}.concept
		INNER JOIN ${config.main_schema}.source_to_concept_map ON source_to_concept_map.omop_concept_id = concept.concept_id and source_to_concept_map.${config.institution_sourcename_column} = '${institutionId}'
		FULL OUTER JOIN ${config.drugunit_cache} ON ${config.drugunit_cache}.${config.institution_sourcename_column} = '${institutionId}'
    WHERE concept.concept_id = ${conceptId}
    ;`;

export const selectDrugExposureCount = (conceptId: number, institutionId: string): string =>
    `
    SELECT person.gender_source_value AS gender,
       (EXTRACT(YEAR FROM drug_exposure.drug_exposure_start_date) - person.year_of_birth) AS age,
       location_source_value AS location,
       COUNT(*) as r_cnt, COUNT(DISTINCT person_id) as p_cnt
    FROM ${config.main_schema}.drug_exposure
        INNER JOIN ${config.main_schema}.person USING (person_id)
        INNER JOIN ${config.main_schema}.location USING(location_id)
    WHERE drug_concept_id = ${conceptId} and drug_source_value = '${institutionId}'
    GROUP BY gender, age, location_source_value
    ;`;

export const selectDrugExposure = (conceptId: number, institutionId: string, start: number, number: number): string =>
    `
    SELECT drug_exposure_id, person_id, provider_id, sig, drug_exposure_start_date, drug_exposure_end_date
    FROM ${config.main_schema}.drug_exposure
    WHERE drug_concept_id = ${conceptId} and drug_source_value = '${institutionId}'
    LIMIT ${number} OFFSET ${start}
    ;`;

export const selectDrugUsedTogether = (conceptId: number, institutionId: string): string =>
    `
    SELECT drug_concept_id, concept_name, drug_source_value, route_source_value, COUNT(*) as count
    FROM (
            SELECT DISTINCT drug_concept_id, person_id, drug_exposure_start_date, drug_source_value, route_source_value
            FROM ${config.main_schema}.drug_exposure
            WHERE
            (person_id, drug_exposure_start_date) IN (
                SELECT DISTINCT person_id, drug_exposure_start_date
                FROM ${config.main_schema}.drug_exposure
                WHERE drug_concept_id = ${conceptId} and drug_source_value = '${institutionId}'
            )
                AND drug_concept_id != ${conceptId}
        ) AS drugs_used_together
        INNER JOIN ${config.main_schema}.concept ON concept.concept_id = drugs_used_together.drug_concept_id
    GROUP BY drug_concept_id, concept_name, drug_source_value,route_source_value
    ORDER BY count DESC
    LIMIT 20
    ;`;

export const selectDrugUsedTogetherPerCondition = (conceptId: number, institutionId: string, condition: string): string =>
    `
    SELECT drug_concept_id, drug_source_value, drug_concept.concept_name, COUNT(*)
    FROM ${config.main_schema}.drug_exposure
        INNER JOIN ${config.main_schema}.concept drug_concept ON drug_exposure.drug_concept_id = drug_concept.concept_id
    WHERE
        drug_concept_id != ${conceptId}
        AND (drug_exposure.person_id, drug_exposure_start_date) IN (
            SELECT drug_exposure.person_id, drug_exposure_start_date
            FROM ${config.main_schema}.drug_exposure
                INNER JOIN ${config.main_schema}.condition_occurrence USING (visit_occurrence_id)
                INNER JOIN ${config.main_schema}.concept condition_concept ON condition_occurrence.condition_concept_id = condition_concept.concept_id
            WHERE
                drug_exposure.drug_concept_id = ${conceptId} AND drug_exposure.drug_source_value = '${institutionId}'
                AND condition_concept.concept_name = '${condition}'
                AND condition_concept.standard_concept = 'S'
        )
    GROUP BY drug_concept_id, drug_source_value, drug_concept.concept_name
    ORDER BY COUNT(*) DESC
    LIMIT 10
    ;`;

export const selectDrugIngredient = (conceptId: number): string =>
    `
    SELECT concept_ingredient.concept_id AS concept_id, concept_ingredient.concept_name AS name,
        COALESCE(drug_strength.amount_value, drug_strength.numerator_value) AS amount,
        concept_unit.concept_name AS unit
    FROM ${config.main_schema}.drug_strength
        INNER JOIN ${config.main_schema}.concept AS concept_ingredient ON drug_strength.ingredient_concept_id = concept_ingredient.concept_id
        FULL OUTER JOIN ${config.main_schema}.concept AS concept_unit ON drug_strength.amount_unit_concept_id = concept_unit.concept_id or drug_strength.numerator_unit_concept_id = concept_unit.concept_id
    WHERE drug_strength.drug_concept_id = ${conceptId}
    ;`;
/*
export const selectDrugTotalQuantityPerPerson = (conceptId: number, institutionId: string): string =>
    `
    SELECT person_id, SUM(quantity_fixed) AS quantity
    FROM public.asclepius__drug_exposure
    WHERE drug_concept_id = ${conceptId} and ${config.institution_sourcename_column} = '${institutionId}'
    GROUP BY person_id
    ;`;*/

export const selectDrugTotalQuantityPerPerson = (conceptId: number, institutionId: string): string =>
    `
    SELECT person_id, SUM(quantity_fixed) AS quantity
    FROM ${config.main_schema}.drug_exposure
    WHERE drug_concept_id = ${conceptId} and ${config.institution_sourcename_column} = '${institutionId}'
    GROUP BY person_id
    ;`;

export const selectPersonByQuantityRange = (conceptId: number, institutionId: string, start: number, end: number): string =>
    `
    SELECT person_id, person.year_of_birth, person.month_of_birth, person.gender_source_value, quantity_per_person.quantity
    FROM (
            SELECT person_id, SUM(quantity_fixed) AS quantity
            FROM public.drug_exposure
            WHERE drug_concept_id = ${conceptId} and ${config.institution_sourcename_column} = '${institutionId}'
            GROUP BY person_id
        ) AS quantity_per_person
        INNER JOIN ${config.main_schema}.person USING (person_id)
    WHERE quantity_per_person.quantity >= ${start} AND quantity_per_person.quantity <= ${end}
    ORDER BY quantity_per_person.quantity
    ;`;

export const selectNumberOfCondition = (conceptId: number, institutionId: string) : string =>
    `
    SELECT concept_name, number
    FROM (
        SELECT concept.concept_id, COUNT(*) AS number
        FROM ${config.main_schema}.drug_exposure
            INNER JOIN ${config.main_schema}.condition_occurrence USING (visit_occurrence_id)
            INNER JOIN ${config.main_schema}.concept ON (concept.concept_id = condition_occurrence.condition_concept_id)
        WHERE drug_exposure.drug_concept_id = ${conceptId} and drug_exposure.drug_source_value = '${institutionId}'
        GROUP BY (concept.concept_id)
        ) AS condition_count
        INNER JOIN ${config.main_schema}.concept USING (concept_id)
    ORDER BY number DESC;
    ;`;

export const selectPurpose = (institutionId: string): string =>
    `
    SELECT DISTINCT atc_cd
    FROM ${config.main_schema}.drug_exposure
    WHERE drug_source_value = '${institutionId}'
    ;`;

export const selectDrugsWithSamePurpose = (institutionId: string): string =>
    `
    SELECT DISTINCT drug_concept_id, drug_source_value
    FROM ${config.main_schema}.drug_exposure
    WHERE atc_cd IN (
        SELECT atc_cd
        FROM ${config.main_schema}.drug_exposure
        WHERE drug_source_value = '${institutionId}'
    )
    ;`;

export const selectDrugExposureTotalCount = (institutionId: string): string =>
    `
    SELECT EXTRACT(year FROM drug_exposure_start_date) AS year, EXTRACT(month FROM drug_exposure_start_date) AS month, COUNT(*)
    FROM ${config.main_schema}.drug_exposure
    WHERE drug_source_value = '${institutionId}'
    GROUP BY EXTRACT(year FROM drug_exposure_start_date), EXTRACT(month FROM drug_exposure_start_date)
    ORDER BY year, month
    ;`;

export const selectSnuhVisitorCount = (): string =>
    `
    SELECT si_do, p_cnt
    FROM ${config.main_schema}.stat_visitor
    ;`;
