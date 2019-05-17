import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "./actionTypes";
import { loaderOn, loaderOff } from "./loaderActions";
import { saveJwt } from '../components/services/localStorage';
import axios from 'axios';

const userDataURL = process.env.REACT_APP_BE_BASE_URL + 'userAuth/login';

export const loginRequest = () => ({
    type: LOGIN_REQUEST
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    error
});
export const loginSuccessful = () => ({
    type: LOGIN_SUCCESS
});

export const AttemptLogin = items => dispatch => {
    dispatch(loaderOn());
    dispatch(loginRequest());
    axios
        .post(userDataURL, items)
        .then((response) => {
            saveJwt(response.data['token']);
            dispatch(loginSuccessful());
            items.loginSuccessful();
            dispatch(loaderOff());
        })
        .catch((error) => {
            let errorMessage;
            if(!!error.response && error.response.status === 401){
                errorMessage = "Incorrect email or password";
            }else{
                errorMessage = "Something went wrong… Please try again later";
            }
            dispatch(loginFailure(errorMessage));
            items.loginUnsuccessful();
            dispatch(loaderOff());
        });
};
