import { REGISTRATION_REQUEST, REGISTRATION_SUCCESS, REGISTRATION_FAILURE } from "./actionTypes";
import { loaderOn, loaderOff } from "./loaderActions";
import axios from 'axios';

const registerURL = process.env.REACT_APP_BE_BASE_URL + 'userAuth/register';

export const registrationRequest = () => ({
    type: REGISTRATION_REQUEST
}); 
export const registrationSuccessful = () => ({
    type: REGISTRATION_SUCCESS
}); 
export const registrationFailure = (errorFetch) => ({
    type: REGISTRATION_FAILURE,
    errorFetch
}); 

export const AttemptRegistration = items => dispatch => {
    dispatch(loaderOn());
    dispatch(registrationRequest());
    axios
        .post(registerURL, items)
        .then(() => {
            dispatch(registrationSuccessful());
            items.registrationSuccessful();
            dispatch(loaderOff());
        })
        .catch((error) => {
            let errorField, errorMessage;
            if (!!error.response) {
                errorField = Object.keys(error.response.data)[0];
                errorMessage = error.response.data[errorField][0];
            }
            else 
                errorMessage = error;
            dispatch(registrationFailure({ field: errorField, message: errorMessage }));
            items.registrationUnsuccessful();
            dispatch(loaderOff());
        });
};
