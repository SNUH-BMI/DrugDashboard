import axios from 'axios';
import config from '../config.json';

const server = config.server + '/api';

export const getDrugData = (drugId, institutionId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/${drugId}/${institutionId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getDrugCount = (drugId, institutionId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/count/${drugId}/${institutionId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getDrugQuantity = (drugId, institutionId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/quantity/${drugId}/${institutionId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getPersonByQuantityRange = (drugId, institutionId, start, end) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/quantity/range/${drugId}/${institutionId}?start=${start}&end=${end}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getDrugTogether = (drugId, institutionId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/together/${drugId}/${institutionId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getDrugTogetherPerCondition = (drugId, institutionId, condition) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/together/${drugId}/${institutionId}/${condition}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });
};

export const getDrugExposure = (drugId, institutionId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/exposure/${drugId}/${institutionId}?start=0&number=10`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getDrugCondition = (drugId, institutionId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/condition/${drugId}/${institutionId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));
    });
};

export const getDrugPurpose = (institutionId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/purpose/${institutionId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getDrugWithSamePurpose = (atcCode) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/drug/purpose/same/${atcCode}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};
