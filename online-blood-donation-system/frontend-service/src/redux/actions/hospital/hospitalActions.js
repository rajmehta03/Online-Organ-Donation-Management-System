import * as types from './index';

export const hospitalRegister = (hospitalData) => ({
    type: types.HOSPITAL_REGISTER,
    payload: hospitalData
});

export const hospitalRegisterSuccess = (hospital) => ({
    type: types.HOSPITAL_REGISTER_SUCCESS,
    payload: hospital
});

export const hospitalRegisterError = (error) => ({
    type: types.HOSPITAL_REGISTER_ERROR,
    payload: error
});

export const hospitalLogin = (credentials) => ({
    type: types.HOSPITAL_LOGIN,
    payload: credentials
});

export const hospitalLoginSuccess = (response) => ({
    type: types.HOSPITAL_LOGIN_SUCCESS,
    payload: response
});

export const hospitalLoginError = (error) => ({
    type: types.HOSPITAL_LOGIN_ERROR,
    payload: error
});

export const hospitalLogout = () => ({
    type: types.HOSPITAL_LOGOUT
});

export const fetchOrganInventory = () => ({
    type: types.FETCH_ORGAN_INVENTORY
});

export const fetchOrganInventorySuccess = (inventory) => ({
    type: types.FETCH_ORGAN_INVENTORY_SUCCESS,
    payload: inventory
});

export const fetchOrganInventoryError = (error) => ({
    type: types.FETCH_ORGAN_INVENTORY_ERROR,
    payload: error
});

export const searchOrgans = (filters) => ({
    type: types.SEARCH_ORGANS,
    payload: filters
});

export const searchOrgansSuccess = (organs) => ({
    type: types.SEARCH_ORGANS_SUCCESS,
    payload: organs
});

export const searchOrgansError = (error) => ({
    type: types.SEARCH_ORGANS_ERROR,
    payload: error
});

export const fetchHospitalRequestsMade = (hospitalId) => ({
    type: types.FETCH_HOSPITAL_REQUESTS_MADE,
    payload: hospitalId
});

export const fetchHospitalRequestsMadeSuccess = (requests) => ({
    type: types.FETCH_HOSPITAL_REQUESTS_MADE_SUCCESS,
    payload: requests
});

export const fetchHospitalRequestsMadeError = (error) => ({
    type: types.FETCH_HOSPITAL_REQUESTS_MADE_ERROR,
    payload: error
});

export const fetchHospitalRequestsReceived = (hospitalId) => ({
    type: types.FETCH_HOSPITAL_REQUESTS_RECEIVED,
    payload: hospitalId
});

export const fetchHospitalRequestsReceivedSuccess = (requests) => ({
    type: types.FETCH_HOSPITAL_REQUESTS_RECEIVED_SUCCESS,
    payload: requests
});

export const fetchHospitalRequestsReceivedError = (error) => ({
    type: types.FETCH_HOSPITAL_REQUESTS_RECEIVED_ERROR,
    payload: error
});
