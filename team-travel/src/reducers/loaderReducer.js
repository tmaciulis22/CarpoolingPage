import * as types from "../actions/actionTypes";

const initialState = {
    showLoader: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.LOADER_ON:
            return {
                ...state,
                showLoader: true
            };
        case types.LOADER_OFF:
            return {
                ...state,
                showLoader: false
            };
        default:
            return state;
    }
}