import axios from 'axios';
import config from '../config.json';

const server = config.server+ '/api';

export const checkBackend = () => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/check/backend`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};

export const checkDatabase = () => {
    return new Promise((resolve, reject) => {

        axios.get(`${server}/check/database`)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error));

    });
};
