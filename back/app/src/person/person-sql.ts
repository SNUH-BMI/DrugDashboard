import config from '../../config/config.json';

export const selectPersonById = (personId: number): string =>
    `
    SELECT person.year_of_birth, person.month_of_birth, person.gender_source_value,
    location.city, location.state, location.location_source_value
    FROM ${config.main_schema}.person
        LEFT JOIN ${config.main_schema}.location USING (location_id)
    WHERE person.person_id = ${personId}
    ;`;

export const selectDrugExposure = (personId: number): string =>
`
SELECT DISTINCT drug_exposure.drug_exposure_id,
    TO_CHAR(drug_exposure.drug_exposure_start_date, 'YYYY-MM-DD') AS start_date, drug_exposure.days_supply,
    drug_exposure.quantity, drug_exposure.dose_unit_source_value, drug_exposure.sig, drug_exposure.provider_id, drug_exposure.route_source_value,
    drug_exposure.drug_concept_id, concept_drug.concept_name AS drug_name,
    condition_occurrence.condition_concept_id, concept_condition.concept_name AS condition_name
FROM ${config.main_schema}.drug_exposure
    LEFT JOIN ${config.main_schema}.concept AS concept_drug ON concept_drug.concept_id = drug_exposure.drug_concept_id
    LEFT JOIN ${config.main_schema}.condition_occurrence USING(visit_occurrence_id)
    LEFT JOIN ${config.main_schema}.concept AS concept_condition ON concept_condition.concept_id = condition_occurrence.condition_concept_id
WHERE drug_exposure.person_id = ${personId}
ORDER BY drug_exposure_id
;`;

export const selectCondition = (personId: number): string =>
    `
    SELECT concept.concept_id, concept.concept_name, COUNT(*)
    FROM ${config.main_schema}.condition_occurrence
        INNER JOIN ${config.main_schema}.concept ON concept.concept_id = condition_occurrence.condition_concept_id
    WHERE person_id = ${personId}
    GROUP BY concept.concept_id, concept.concept_name
    ORDER BY COUNT(*) DESC
    ;`;

export const selectVisitByCondition = (personId: number, condition: string): string =>
    `
    SELECT visit_occurrence.visit_occurrence_id, visit_occurrence.visit_concept_id, visit_occurrence.visit_start_date, visit_occurrence.visit_end_date,
           visit_occurrence.visit_type_concept_id, visit_occurrence.provider_id, visit_occurrence.care_site_id, visit_occurrence.visit_source_value,
           condition_occurrence.condition_concept_id
    FROM ${config.main_schema}.visit_occurrence
        INNER JOIN ${config.main_schema}.condition_occurrence ON condition_occurrence.visit_occurrence_id = visit_occurrence.visit_occurrence_id
    WHERE visit_occurrence.person_id = ${personId}
        AND ${condition}
    ;`;

export const selectDrugEra = (personId: number): string =>
    `
    SELECT drug_concept_id, concept_name, drug_era_start_date, drug_era_end_date
    FROM ${config.main_schema}.drug_era
        INNER JOIN ${config.main_schema}.concept ON (concept.concept_id = drug_era.drug_concept_id)
    WHERE person_id = ${personId}
    ORDER BY drug_era_start_date
    ;`;
