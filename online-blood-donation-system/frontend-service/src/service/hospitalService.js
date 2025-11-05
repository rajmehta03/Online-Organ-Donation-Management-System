import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export const registerHospital = (hospitalData) => {
    return axios.post(`${BASE_URL}/hospital/register`, hospitalData);
};

export const loginHospital = (credentials) => {
    return axios.post(`${BASE_URL}/hospital/login`, credentials);
};

export const getHospital = (hospitalId) => {
    return axios.get(`${BASE_URL}/hospital/${hospitalId}`);
};

export const getOrganInventory = () => {
    return axios.get(`${BASE_URL}/organs/inventory`);
};

export const searchOrgans = (filters) => {
    const params = {};
    if (filters.organType) params.organType = filters.organType;
    if (filters.pincode) params.pincode = filters.pincode;
    if (filters.city) params.city = filters.city;
    
    return axios.get(`${BASE_URL}/organs/search`, { params });
};

export const getHospitalOrgans = (hospitalId) => {
    return axios.get(`${BASE_URL}/organs/hospital/${hospitalId}`);
};

export const getHospitalRequestsMade = (hospitalId) => {
    return axios.get(`${BASE_URL}/hospital/${hospitalId}/requests/made`);
};

export const getHospitalRequestsReceived = (hospitalId) => {
    return axios.get(`${BASE_URL}/hospital/${hospitalId}/requests/received`);
};
