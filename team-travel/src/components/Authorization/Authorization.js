import React, { Component } from "react";
import { parseJwt } from "../services/localStorage";
import { Redirect } from "react-router";
import moment from "moment";

export const Authorization = (WrappedComponent, allowed) => class AuthController extends Component {
    render() {
        let user;
        try {
            user = parseJwt();
            if(moment().isAfter(moment.unix(user.exp))) {
                return <Redirect to='/login'/>;
            }
        } catch (error) {
            return <Redirect to='/login'/>;
        }

        if (user.roles.includes(allowed)) {
            return <WrappedComponent {...this.props} />
        } else {
            return <Redirect to='/carpooling'/>;
        }
    }
};