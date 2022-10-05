import config from '../../config/config.json';

export const selectDrugByQuery = (query: string): string =>
    `
    SELECT concept.concept_id, concept.concept_name, concept.vocabulary_id, source_to_concept_map.${config.institution_sourcename_column}, source_to_concept_map.source_name, COALESCE(exposure_count.count, 0) AS use_count
    FROM ${config.main_schema}.concept
        INNER JOIN ${config.main_schema}.source_to_concept_map ON concept.concept_id = source_to_concept_map.omop_concept_id
        FULL OUTER JOIN (
            SELECT drug_concept_id, drug_source_value, COUNT(*)
            FROM ${config.main_schema}.drug_exposure
            GROUP BY drug_concept_id, drug_source_value
        ) AS exposure_count ON concept.concept_id = exposure_count.drug_concept_id and source_to_concept_map.${config.institution_sourcename_column} = exposure_count.drug_source_value
    WHERE (
            LOWER(CAST(concept.concept_id AS TEXT)) LIKE LOWER('%${query}%') 
            OR LOWER(concept.concept_name) LIKE LOWER('%${query}%')
            OR LOWER(CAST(source_to_concept_map.${config.institution_sourcename_column} AS TEXT)) LIKE LOWER('%${query}%')
            OR LOWER(source_to_concept_map.source_name) LIKE LOWER('%${query}%')
        )
        AND domain_id = 'Drug'
    ORDER BY use_count DESC
    ;`;

export const selectIngredientByQuery = (query: string): string =>
    `
    SELECT concept.concept_id, concept.concept_name, concept.vocabulary_id, COALESCE(contain_count.count, 0) AS drug_count
    FROM ${config.main_schema}.concept
        FULL OUTER JOIN (
            SELECT drug_strength.ingredient_concept_id, COUNT(DISTINCT concept_drug.concept_id)
            FROM ${config.main_schema}.drug_strength
                INNER JOIN ${config.main_schema}.source_to_concept_map ON drug_strength.drug_concept_id = source_to_concept_map.omop_concept_id
                INNER JOIN ${config.main_schema}.concept AS concept_drug ON drug_strength.drug_concept_id = concept_drug.concept_id
                FULL OUTER JOIN ${config.main_schema}.concept AS concept_unit ON drug_strength.amount_unit_concept_id = concept_unit.concept_id
            GROUP BY drug_strength.ingredient_concept_id
        ) AS contain_count ON contain_count.ingredient_concept_id = concept.concept_id
    WHERE (
            LOWER(CAST(concept.concept_id AS TEXT)) LIKE LOWER('%${query}%')
            OR LOWER(concept.concept_name) LIKE LOWER('%${query}%')
        )
        AND concept.concept_class_id = 'Ingredient'
    ORDER BY drug_count DESC
    ;`;

export const selectConditionByQuery = (query: string): string =>
    `
    SELECT concept_id, concept_name
    FROM ${config.main_schema}.concept
    WHERE (
        LOWER(CAST(concept.concept_id AS TEXT)) LIKE LOWER('%${query}%')
        OR LOWER(concept.concept_name) LIKE LOWER('%${query}%')
    )
    AND domain_id = 'Condition'
    AND standard_concept = 'S'
    ;`;

export const selectDrugADR = (conceptId: string, term: number) =>
    `SELECT ddmc.person_id, ddmc.measurement_concept_id, ddmc.measurement_date, ddmc.gender_source_value, ddmc.age_normalized, ddmc.is_in_range
    FROM (SELECT ddcf.drug_exposure_start_date, ddcf.person_id FROM ${config.main_exposure_cache} AS ddcf
    WHERE drug_concept_id IN ${conceptId} GROUP BY ddcf.person_id, ddcf.drug_exposure_start_date) AS dd
    INNER JOIN ${config.measurement_cache} AS ddmc ON (ddmc.measurement_date BETWEEN dd.drug_exposure_start_date AND dd.drug_exposure_start_date+${term}) AND ddmc.person_id = dd.person_id
    GROUP BY ddmc.person_id, ddmc.measurement_concept_id, ddmc.measurement_date, ddmc.gender_source_value, ddmc.age_normalized, ddmc.is_in_range
    ;`;

export const selectNewExposure = (conceptList: string) =>
    `SELECT EXTRACT(year FROM drug_exposure_start_date) AS year, sum(count)
    FROM ${config.main_exposure_cache}
    WHERE drug_concept_id IN ${conceptList}
    GROUP BY EXTRACT(year FROM drug_exposure_start_date)
    ORDER BY year
    ;`;