import { REGISTRATION_REQUEST, REGISTRATION_SUCCESS, REGISTRATION_FAILURE } from "../actions/actionTypes";

const initialState = {
    registrationInProgress: false,
    errorFetch: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case REGISTRATION_REQUEST:
            return {
                ...state,
                registrationInProgress: true,
                errorFetch: {}
            };
        case REGISTRATION_SUCCESS:
            return {
                ...state,
                registrationInProgress: false,
                errorFetch: {}
        };
        case REGISTRATION_FAILURE:
            return {
                ...state,
                registrationInProgress: false,
                errorFetch: action.errorFetch
            };
        default:
            return state;
    }
};