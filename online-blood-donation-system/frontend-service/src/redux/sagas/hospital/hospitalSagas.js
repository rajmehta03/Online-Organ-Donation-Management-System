import { call, put } from 'redux-saga/effects';
import * as hospitalService from '../../../service/hospitalService';
import * as actions from '../../actions/hospital/hospitalActions';

export function* registerHospital(action) {
    try {
        const { data } = yield call(hospitalService.registerHospital, action.payload);
        yield put(actions.hospitalRegisterSuccess(data));
    } catch (error) {
        const message = error.response?.data?.userMessage || error.message || 'Registration failed';
        yield put(actions.hospitalRegisterError(message));
    }
}

export function* loginHospital(action) {
    try {
        const { data } = yield call(hospitalService.loginHospital, action.payload);
        yield put(actions.hospitalLoginSuccess(data));
    } catch (error) {
        const message = error.response?.data?.userMessage || error.message || 'Login failed';
        yield put(actions.hospitalLoginError(message));
    }
}

export function* fetchOrganInventory() {
    try {
        const { data } = yield call(hospitalService.getOrganInventory);
        yield put(actions.fetchOrganInventorySuccess(data));
    } catch (error) {
        const message = error.response?.data?.userMessage || error.message || 'Failed to fetch inventory';
        yield put(actions.fetchOrganInventoryError(message));
    }
}

export function* searchOrgans(action) {
    try {
        const { data } = yield call(hospitalService.searchOrgans, action.payload);
        yield put(actions.searchOrgansSuccess(data));
    } catch (error) {
        const message = error.response?.data?.userMessage || error.message || 'Search failed';
        yield put(actions.searchOrgansError(message));
    }
}

export function* fetchHospitalRequestsMade(action) {
    try {
        const { data } = yield call(hospitalService.getHospitalRequestsMade, action.payload);
        yield put(actions.fetchHospitalRequestsMadeSuccess(data));
    } catch (error) {
        const message = error.response?.data?.userMessage || error.message || 'Failed to fetch requests';
        yield put(actions.fetchHospitalRequestsMadeError(message));
    }
}

export function* fetchHospitalRequestsReceived(action) {
    try {
        const { data } = yield call(hospitalService.getHospitalRequestsReceived, action.payload);
        yield put(actions.fetchHospitalRequestsReceivedSuccess(data));
    } catch (error) {
        const message = error.response?.data?.userMessage || error.message || 'Failed to fetch requests';
        yield put(actions.fetchHospitalRequestsReceivedError(message));
    }
}
