import React, { Component } from "react";
import { parseJwt } from "../services/localStorage";
import { Redirect } from "react-router";

export const Authorization = (WrappedComponent, allowed) => class AuthController extends Component {
    render() {
        let user;
        try {
            user = parseJwt();
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