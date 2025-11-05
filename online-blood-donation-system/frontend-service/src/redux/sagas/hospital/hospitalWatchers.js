import { takeLatest } from 'redux-saga/effects';
import * as types from '../../actions/hospital/index';
import * as sagas from './hospitalSagas';

export function* watchHospitalRegister() {
    yield takeLatest(types.HOSPITAL_REGISTER, sagas.registerHospital);
}

export function* watchHospitalLogin() {
    yield takeLatest(types.HOSPITAL_LOGIN, sagas.loginHospital);
}

export function* watchFetchOrganInventory() {
    yield takeLatest(types.FETCH_ORGAN_INVENTORY, sagas.fetchOrganInventory);
}

export function* watchSearchOrgans() {
    yield takeLatest(types.SEARCH_ORGANS, sagas.searchOrgans);
}

export function* watchFetchHospitalRequestsMade() {
    yield takeLatest(types.FETCH_HOSPITAL_REQUESTS_MADE, sagas.fetchHospitalRequestsMade);
}

export function* watchFetchHospitalRequestsReceived() {
    yield takeLatest(types.FETCH_HOSPITAL_REQUESTS_RECEIVED, sagas.fetchHospitalRequestsReceived);
}
