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
import axios from 'axios';
import { loadJwt } from './../components/services/localStorage';
import { loaderOn, loaderOff } from './../actions/loaderActions';

const adminUrl = process.env.REACT_APP_BE_BASE_URL + 'admin';
const config = () => ({
    headers: {
        'Authorization': 'Bearer ' + loadJwt()
    }
});

export const fetchAdminUserDataRequest = () => ({
    type: FETCH_ADMIN_USER_DATA_REQUEST
});

export const fetchAdminUserDataSuccess = UserDataAdmin => ({
    type: FETCH_ADMIN_USER_DATA_SUCCESS,
    UserDataAdmin
});

export const fetchAdminUserDataFailure = error => ({
    type: FETCH_ADMIN_USER_DATA_FAILURE,
    error
});

export const fetchUserDataAdmin = () => dispatch => {

    dispatch(loaderOn());
    dispatch(fetchAdminUserDataRequest());
    axios
        .get(adminUrl, config())
        .then(response => {
            dispatch(fetchAdminUserDataSuccess(response.data));
            dispatch(loaderOff());
        })
        .catch(error => {
            dispatch(fetchAdminUserDataFailure(error));
            dispatch(loaderOff());
        })

};
export const updateAdminUserDataRequest = () => ({
    type: UPDATE_ADMIN_USER_DATA_REQUEST
});

export const updateAdminUserDataSuccess = () => ({
    type: UPDATE_ADMIN_USER_DATA_SUCCESS,
});

export const updateAdminUserDataFailure = error => ({
    type: UPDATE_ADMIN_USER_DATA_FAILURE,
    error
});

export const updateUserData = userDataAdmin => dispatch => {

    dispatch(updateAdminUserDataRequest());
    axios
        .put(adminUrl, userDataAdmin.userDataAdmin, config())
        .then(() => {
            dispatch(updateAdminUserDataSuccess());
            dispatch(loaderOff());
            window.location.reload();
        })
        .catch(error => {
            let errorField, errorMessage;

            if (!!error.response) {
                errorField = Object.keys(error.response.data)[0];
                errorMessage = error.response.data[errorField][0];
            }
            else
                dispatch(loaderOff());
            errorMessage = error;
            dispatch(updateAdminUserDataFailure({ field: errorField, message: errorMessage }));
        })
};

export const deleteUserRequest = () => ({
    type: DELETE_ADMIN_USER_REQUEST,
});

export const deleteUserSuccess = id => ({
    type: DELETE_ADMIN_USER_SUCCESS,
    id
});

export const deleteUserFailure = error => ({
    type: DELETE_ADMIN_USER_FAILURE,
    error
});

export const deleteUser = item => dispatch => {
    let id = item.id;
    let queryTodelete = "/" + id;

    dispatch(loaderOn());
    dispatch(deleteUserRequest());

    axios
        .delete(adminUrl + queryTodelete, config())
        .then((response) => {
            dispatch(deleteUserSuccess(id));
            dispatch(loaderOff());
        })
        .catch(error => {
            let errorMessage = "There was a problem while deleting the user... Please try again later";
            dispatch(deleteUserFailure(errorMessage));
            dispatch(loaderOff());
        });
};