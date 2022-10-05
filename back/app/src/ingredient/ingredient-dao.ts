import * as DB from '../db';
import * as ingredientSQL from './ingredient-sql';

export const getIngredient = (conceptId: number): Promise<{
    concept_id: number,
    concept_name: string,
    domain_id: string,
    vocabulary_id: string,
    concept_class_id: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectIngredient = await DB.run(ingredientSQL.selectIngredient(conceptId));
            resolve(selectIngredient[0]);

        } catch(error) { reject(error); }

    });
};

export const getDrugContainingIngredient = (conceptId: number): Promise<{
    concept_id: number,
    name: string,
    amount: string,
    unit: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectDrugContainingIngredient = await DB.run(ingredientSQL.selectDrugContainingIngredient(conceptId));
            resolve(selectDrugContainingIngredient);

        } catch(error) { reject(error); }

    });
};

export const getIngredientTotalQuantityPerPerson = (conceptId: number): Promise<{
    person_id: number,
    quantity: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectIngredientTotalQuantityPerPerson = await DB.run(ingredientSQL.selectIngredientTotalQuantityPerPerson(conceptId));
            resolve(selectIngredientTotalQuantityPerPerson);

        } catch(error) { reject(error); }

    });
};

export const getPersonByIngredientQuantityRange = (conceptId: number, start: number, end: number): Promise<{
    person_id: number,
    year_of_birth: number,
    month_of_birth: number,
    gender_source_value: string,
    quantity: string
}[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectPersonByIngredientQuantityRange = await DB.run(ingredientSQL.selectPersonByIngredientQuantityRange(conceptId, start, end));
            resolve(selectPersonByIngredientQuantityRange);

        } catch(error) { reject(error); }

    });
};
