import { checkBackend, checkDatabase } from './check';
import { getDrugData, getDrugCount, getDrugQuantity, getPersonByQuantityRange, getDrugTogether, getDrugTogetherPerCondition, getDrugExposure, getDrugCondition, getDrugPurpose, getDrugWithSamePurpose } from './drug';
import { getIngredientData, getIngredientContainList, getIngredientQuantity, getPersonByIngredientQuantityRange } from './ingredient';
import { searchDrug, searchIngredient, searchAtcCode, searchCondition, conditionalSearch, conditionalSearchChart } from './search';
import { getPersonData, getPersonDrugExposure, getPersonCondition, getPersonVisit, getPersonDrugEra } from './person';

export default {
    check: { checkBackend, checkDatabase },
    drug: { getDrugData, getDrugCount, getDrugQuantity, getPersonByQuantityRange, getDrugTogether, getDrugTogetherPerCondition, getDrugExposure, getDrugCondition, getDrugPurpose, getDrugWithSamePurpose },
    ingredient: { getIngredientData, getIngredientContainList, getIngredientQuantity, getPersonByIngredientQuantityRange },
    search: { searchDrug, searchIngredient, searchAtcCode, searchCondition, conditionalSearch, conditionalSearchChart },
    person: { getPersonData, getPersonDrugExposure, getPersonCondition, getPersonVisit, getPersonDrugEra }
};
