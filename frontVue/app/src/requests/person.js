import axios from 'axios';
import config from '../config.json';

const server = config.server+ '/api';

export const getPersonData = (personId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/person/${personId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getPersonDrugExposure = (personId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/person/drug/exposure/${personId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getPersonCondition = (personId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/person/condition/${personId}`)
            .then((response) => resolve(response.data))
            .catch((error => reject(error)));
    })
};

export const getPersonVisit = (personId, condition) => {
    return new Promise((resolve, reject) => {

        const request = {
            params: {
                condition: condition
            }
        }
        axios.get(`${server}/person/visit/${personId}`, request)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getPersonDrugEra = (personId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/person/era/${personId}`)
            .then((response) => resolve(response.data))
            .catch(error => reject(error));

    });
};
