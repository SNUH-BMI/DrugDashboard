import axios from 'axios';
import config from '../config.json';

const server = config.server+ '/api';

export const getIngredientData = (ingredientId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/ingredient/${ingredientId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getIngredientContainList = (ingredientId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/ingredient/contain/${ingredientId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getIngredientQuantity = (drugId) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/ingredient/quantity/${drugId}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const getPersonByIngredientQuantityRange = (drugId, start, end) => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/ingredient/quantity/range/${drugId}?start=${start}&end=${end}`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};
