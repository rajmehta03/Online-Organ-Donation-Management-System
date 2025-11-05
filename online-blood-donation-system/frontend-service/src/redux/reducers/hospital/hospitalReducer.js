import * as types from '../../actions/hospital/index';

const initialState = {
    hospital: null,
    inventory: {},
    searchResults: [],
    requestsMade: [],
    requestsReceived: [],
    loading: false,
    error: null
};

const hospitalReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.HOSPITAL_REGISTER:
        case types.HOSPITAL_LOGIN:
        case types.FETCH_ORGAN_INVENTORY:
        case types.SEARCH_ORGANS:
        case types.FETCH_HOSPITAL_REQUESTS_MADE:
        case types.FETCH_HOSPITAL_REQUESTS_RECEIVED:
            return {
                ...state,
                loading: true,
                error: null
            };

        case types.HOSPITAL_REGISTER_SUCCESS:
        case types.HOSPITAL_LOGIN_SUCCESS:
            return {
                ...state,
                hospital: action.payload,
                loading: false,
                error: null
            };

        case types.FETCH_ORGAN_INVENTORY_SUCCESS:
            return {
                ...state,
                inventory: action.payload,
                loading: false,
                error: null
            };

        case types.SEARCH_ORGANS_SUCCESS:
            return {
                ...state,
                searchResults: action.payload,
                loading: false,
                error: null
            };

        case types.FETCH_HOSPITAL_REQUESTS_MADE_SUCCESS:
            return {
                ...state,
                requestsMade: action.payload,
                loading: false,
                error: null
            };

        case types.FETCH_HOSPITAL_REQUESTS_RECEIVED_SUCCESS:
            return {
                ...state,
                requestsReceived: action.payload,
                loading: false,
                error: null
            };

        case types.HOSPITAL_LOGOUT:
            localStorage.removeItem('hospital');
            localStorage.removeItem('token');
            return {
                ...initialState
            };

        case types.HOSPITAL_REGISTER_ERROR:
        case types.HOSPITAL_LOGIN_ERROR:
        case types.FETCH_ORGAN_INVENTORY_ERROR:
        case types.SEARCH_ORGANS_ERROR:
        case types.FETCH_HOSPITAL_REQUESTS_MADE_ERROR:
        case types.FETCH_HOSPITAL_REQUESTS_RECEIVED_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};

export default hospitalReducer;
