import {
    FETCH_USER_DATA_REQUEST,
    FETCH_USER_DATA_SUCCESS,
    FETCH_USER_DATA_FAILURE,
    UPDATE_USER_DATA_REQUEST,
    UPDATE_USER_DATA_SUCCESS,
    UPDATE_USER_DATA_FAILURE
} from '../actions/actionTypes';

const initialState = {
    fetchDataInProgress: false,
    updateDataInProgress: false,
    error: {},
    userData: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_DATA_REQUEST: {
            return {
                ...state,
                fetchDataInProgress: true,
                error: {}
            };
        }
        case FETCH_USER_DATA_SUCCESS:
            return {
                ...state,
                fetchDataInProgress: false,
                userData: action.userData
            };
        case FETCH_USER_DATA_FAILURE: {
            return {
                ...state,
                fetchDataInProgress: false,
                error: action.error
            };
        }
        case UPDATE_USER_DATA_REQUEST: {
            return {
                ...state,
                updateDataInProgress: true,
                error: {}
            };
        }
        case UPDATE_USER_DATA_SUCCESS:
            return {
                ...state,
                updateDataInProgress: false,
            };
        case UPDATE_USER_DATA_FAILURE: {
            return {
                ...state,
                updateDataInProgress: false,
                error: action.error
            };
        }
        default:
            return state;
    }
};