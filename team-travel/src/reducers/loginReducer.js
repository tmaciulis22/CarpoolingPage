import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE} from "../actions/actionTypes";

const initialState = {
    loginInProgress: false,
    error: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return{
                ...state,
                loginInProgress: true,
                error: ''
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loginInProgress: false,
                error: ''
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loginInProgress: false,
                error: action.error
            };
        default:
            return state;
    }
};