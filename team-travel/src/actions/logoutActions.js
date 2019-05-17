import { USER_LOGOUT } from "./actionTypes";
import { deleteJwt } from '../components/services/localStorage';

export const clearSession = () => dispatch => {
    deleteJwt();
    dispatch(userLogout());
};

export const userLogout = () => ({
    type: USER_LOGOUT,
});