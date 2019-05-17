import {
    FETCH_USER_DATA_REQUEST,
    FETCH_USER_DATA_SUCCESS,
    FETCH_USER_DATA_FAILURE,
    UPDATE_USER_DATA_REQUEST,
    UPDATE_USER_DATA_SUCCESS,
    UPDATE_USER_DATA_FAILURE
} from '../actions/actionTypes';
import axios from 'axios';
import { loadJwt } from './../components/services/localStorage'; 
import { loaderOn, loaderOff } from './../actions/loaderActions';

const usersUrl = process.env.REACT_APP_BE_BASE_URL+'Customers/me';
const config = () => ({
    headers: {
        'Authorization': 'Bearer ' + loadJwt()
    }
});

export const fetchUserDataRequest = () => ({
    type: FETCH_USER_DATA_REQUEST
});

export const fetchUserDataSuccess = userData => ({
    type: FETCH_USER_DATA_SUCCESS,
    userData
});

export const fetchUserDataFailure = error => ({
    type: FETCH_USER_DATA_FAILURE,
    error
});

export const fetchUserData = () => dispatch => {
    dispatch(loaderOn());
    dispatch(fetchUserDataRequest());
    axios
        .get(usersUrl, config())
        .then(response => {
            dispatch(fetchUserDataSuccess(response.data));
            dispatch(loaderOff());
        })
        .catch(error => {
            let errorMessage = "There was a problem while loading your data... Please try again later"
            dispatch(fetchUserDataFailure({ field: "", message: errorMessage }));
            dispatch(loaderOff());
        })
};

export const updateUserDataRequest = () => ({
    type: UPDATE_USER_DATA_REQUEST
});

export const updateUserDataSuccess = () => ({
    type: UPDATE_USER_DATA_SUCCESS,
});

export const updateUserDataFailure = error => ({
    type: UPDATE_USER_DATA_FAILURE,
    error
});

export const updateUserData = userData => dispatch => {
    dispatch(loaderOn());
    dispatch(updateUserDataRequest());
    axios
        .put(usersUrl, {
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            slackId: userData.slackId,
            mainOffice: userData.mainOffice,
            isDriver: userData.isDriver,
            carPlates: userData.carPlates,
            oldPassword: userData.oldPassword,
            newPassword: userData.newPassword
        }, config())
        .then(() => {
            dispatch(updateUserDataSuccess());
            userData.updateSuccessful();
            dispatch(loaderOff());
        })
        .catch(error => {
            let errorMessage, errorField;

            if (!!error.response) {
                errorField = Object.keys(error.response.data)[0];
                errorMessage = error.response.data[errorField][0];
            }
            else {
                errorMessage = "There was a problem while updating your data... Please try again later";
            }
            dispatch(loaderOff());
            dispatch(updateUserDataFailure({ field: errorField, message: errorMessage }));
            userData.updateUnsuccessful();
        })
};