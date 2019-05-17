import * as types from './actionTypes';

export const updateRowSelection = param => ({
    type: types.UPDATE_SELECTED_ROWS,
    param
});

export const filterSelectedRows = param => ({
    type: types.FILTER_SELECTED_ROWS,
    param
});