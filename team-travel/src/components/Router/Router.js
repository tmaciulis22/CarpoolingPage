import React, { Component } from 'react';
import {
    BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import LoginForm from '../../pages/LoginPage/LoginPage';
import RegistrationPage from '../../pages/RegistrationPage/RegistrationPage';
import CarpoolingPage from '../../pages/CarpoolingPage/CarpoolingPage';
import UserSettingsPage from '../../pages/UserSettingsPage/UserSettingPage';
import ReportsPage from '../../pages/ReportsPage/ReportsPage';
import AdminPage from '../../pages/AdminPage/AdminPage';
import NotFound from '../../pages/NotFound/NotFound'
import {connect} from "react-redux";
import { RotateSpinner } from "react-spinners-kit";
import './loaderContainer.scss'
import {Authorization} from "../Authorization/Authorization";

// second parameter means that user must have at least this role
const Carpooling = Authorization(CarpoolingPage, 'User');
const Settings = Authorization(UserSettingsPage, 'User');
const Reports = Authorization(ReportsPage, 'Manager');
const Admin = Authorization(AdminPage, 'Admin');

class RouterComponent extends Component {
    render() {
        return (
            <div>
                <div className={this.props.isLoading ? "loaderContainer" : "loaderContainer -disabled"}>
                    <div className="spinner">
                        <RotateSpinner
                            size={50}
                            color="#404ced"
                            loading={this.props.isLoading}
                        />
                    </div>
                </div>

                <Router>
                    <Switch>
                        <Route path="/login" component={LoginForm}/>
                        <Route exact path="/" component={LoginForm}/>
                        <Route path="/carpooling" component={Carpooling}/>
                        <Route path="/registration" component={RegistrationPage}/>
                        <Route path="/settings" component={Settings}/>
                        <Route path="/reports" component={Reports}/>
                        <Route path="/admin" component={Admin}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default connect(
    state => ({
        isLoading: state.loaderReducer.showLoader,
    }),
)(RouterComponent);
