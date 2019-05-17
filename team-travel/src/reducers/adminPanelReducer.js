import {
    FETCH_ADMIN_USER_DATA_REQUEST,
    FETCH_ADMIN_USER_DATA_SUCCESS,
    FETCH_ADMIN_USER_DATA_FAILURE,
    UPDATE_ADMIN_USER_DATA_REQUEST,
    UPDATE_ADMIN_USER_DATA_SUCCESS,
    UPDATE_ADMIN_USER_DATA_FAILURE,
    DELETE_ADMIN_USER_REQUEST,
    DELETE_ADMIN_USER_SUCCESS,
    DELETE_ADMIN_USER_FAILURE
} from '../actions/actionTypes';

const initialState = {
    fetchDataInProgress: false,
    updateDataInProgress: false,
    error: '',
    userDataAdmin: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ADMIN_USER_DATA_REQUEST: {
            return {
                ...state,
                fetchDataInProgress: true,
                error: ''
            };
        }
        case FETCH_ADMIN_USER_DATA_SUCCESS:
            return {
                ...state,
                fetchDataInProgress: false,
                userDataAdmin: action.UserDataAdmin
            };
        case FETCH_ADMIN_USER_DATA_FAILURE: {
            return {
                ...state,
                fetchDataInProgress: false,
                error: action.error
            };
        }
        case UPDATE_ADMIN_USER_DATA_REQUEST: {
            return {
                ...state,
                updateDataInProgress: true,
                error: ''
            };
        }
        case UPDATE_ADMIN_USER_DATA_SUCCESS:
            return {
                ...state,
                updateDataInProgress: false,
            };
        case UPDATE_ADMIN_USER_DATA_FAILURE: {
            return {
                ...state,
                updateDataInProgress: false,
                error: action.error
            };
        }
        case DELETE_ADMIN_USER_REQUEST:
            return {
                ...state,
                fetchDataInProgress: true,
                errorFetch: ''
            };
        case DELETE_ADMIN_USER_SUCCESS:  

        return  {
            ...state,
            userDataAdmin: state.userDataAdmin.filter(userDataAdmin => userDataAdmin.id !== action.id),
            fetchDataInProgress: false
        };     
        
        case DELETE_ADMIN_USER_FAILURE:
            return {
                ...state,
                fetchDataInProgress: false,
                error: action.error
            };     
        default:
            return state;
    }
};