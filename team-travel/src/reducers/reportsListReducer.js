import * as types from '../actions/actionTypes';

const initialState = {
    selectedRows: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_SELECTED_ROWS:
            return { ...state, selectedRows: action.param };
        case types.FILTER_SELECTED_ROWS:
            let filteredTrips = action.param;
            let filteredSelectedRows = state.selectedRows.filter(trip => filteredTrips.includes(trip));

            return { 
                ...state, 
                selectedRows: filteredSelectedRows,
            };
        default:
            return state;
    }
};