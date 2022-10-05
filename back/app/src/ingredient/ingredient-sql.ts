import config from '../../config/config.json';

export const selectIngredient = (conceptId: number): string =>
    `
    SELECT concept_id, concept_name, domain_id, vocabulary_id, concept_class_id
    FROM ${config.main_schema}.concept
    WHERE concept_id = ${conceptId}
    ;`;

export const selectDrugContainingIngredient = (conceptId: number): string =>
    `
    SELECT DISTINCT concept_drug.concept_id AS concept_id, concept_drug.concept_name AS name, source_to_concept_map.${config.institution_sourcename_column} AS ${config.institution_sourcename_column},
                    drug_strength.amount_value AS amount,
                    concept_unit.concept_name AS unit
    FROM ${config.main_schema}.drug_strength
        INNER JOIN ${config.main_schema}.source_to_concept_map ON source_to_concept_map.omop_concept_id = drug_strength.drug_concept_id
        INNER JOIN ${config.main_schema}.concept AS concept_drug ON concept_drug.concept_id = drug_strength.drug_concept_id
        FULL OUTER JOIN ${config.main_schema}.concept AS concept_unit ON concept_unit.concept_id = drug_strength.amount_unit_concept_id
    WHERE drug_strength.ingredient_concept_id = ${conceptId}
    ORDER BY concept_id
    ;`;

export const selectIngredientTotalQuantityPerPerson = (conceptId: number): string =>
    `
    SELECT person_id, SUM(quantity) AS quantity
    FROM (
            SELECT drug_exposure.person_id, drug_exposure.drug_concept_id, drug_exposure.quantity, drug_exposure.dose_unit_source_value,
                drug_strength.amount_value, drug_strength.amount_unit_concept_id
            FROM ${config.main_schema}.drug_exposure
                INNER JOIN ${config.main_schema}.drug_strength ON drug_strength.drug_concept_id = drug_exposure.drug_concept_id
            WHERE drug_strength.ingredient_concept_id = ${conceptId}
        ) AS ingredient_amount_per_person
    GROUP BY person_id
    ;`;

export const selectPersonByIngredientQuantityRange = (conceptId: number, start: number, end: number): string =>
    `
    SELECT person_quantity.person_id, person.year_of_birth, person.month_of_birth, person.gender_source_value, person_quantity.quantity
    FROM (
            SELECT person_id, SUM(quantity) AS quantity
            FROM (
                    SELECT drug_exposure.person_id, drug_exposure.drug_concept_id, drug_exposure.quantity, drug_exposure.dose_unit_source_value,
                        drug_strength.amount_value, drug_strength.amount_unit_concept_id
                    FROM ${config.main_schema}.drug_exposure
                        INNER JOIN ${config.main_schema}.drug_strength ON drug_strength.drug_concept_id = drug_exposure.drug_concept_id
                    WHERE drug_strength.ingredient_concept_id = ${conceptId}
                ) AS ingredient_amount_per_person
            GROUP BY person_id
        ) AS person_quantity
        INNER JOIN ${config.main_schema}.person ON person.person_id = person_quantity.person_id
    WHERE person_quantity.quantity >= ${start} AND person_quantity.quantity <= ${end}
    ORDER BY person_quantity.quantity
    ;`;
