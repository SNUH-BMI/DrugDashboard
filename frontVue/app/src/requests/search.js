import axios from 'axios';
import config from '../config.json';

const server = config.server+ '/api';

export const searchDrug = (searchText) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/search/drug/${searchText}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const searchIngredient = (searchText) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/search/ingredient/${searchText}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const searchAtcCode = (searchText) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/search/atc/${searchText}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const searchCondition = (searchText) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/search/condition/${searchText}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const conditionalSearch = (age, gender, conditionType, conditionList, drugType, drugList, drugSimultaneous, atcType, atcList, atcSimultaneous, simultaneousNumber) => {
    return new Promise((resolve, reject) => {

        axios.post(`${server}/search/conditional`,
            {
                age: age,
                gender: gender,
                conditionType: conditionType,
                conditionList: conditionList,
                drugType: drugType,
                drugList: drugList,
                drugSimultaneous: drugSimultaneous,
                atcType: atcType,
                atcList: atcList,
                atcSimultaneous: atcSimultaneous,
                simultaneousNumber: simultaneousNumber
            })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const conditionalSearchChart = (age, gender, conditionType, conditionList, drugType, drugList, drugSimultaneous, atcType, atcList, atcSimultaneous, simultaneousNumber) => {
    return new Promise((resolve, reject) => {

        axios.post(`${server}/search/conditional/chart`,
            {
                age: age,
                gender: gender,
                conditionType: conditionType,
                conditionList: conditionList,
                drugType: drugType,
                drugList: drugList,
                drugSimultaneous: drugSimultaneous,
                atcType: atcType,
                atcList: atcList,
                atcSimultaneous: atcSimultaneous,
                simultaneousNumber: simultaneousNumber
            })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};
