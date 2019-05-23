import React, { Component } from 'react';
import Button from '../Button/Button';
import './Styles/header.scss';
import './Styles/_navigation.scss'
import './Styles/_profile-picture.scss'
import '../../../styles/styles.scss';
import NotificationsDropdown from '../notifications-dropdown/NotificationsDropdown';
import { Link } from "react-router-dom";
import { clearSession } from "./../../../actions/logoutActions";
import { matchPath } from "react-router";
import { parseJwt } from "../../services/localStorage";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import Avatar from 'react-avatar';

class Pageheader extends Component {
    render() {
        return (
                <header >
                    <div className="header">
                        
                            { !matchPath( window.location.pathname,'/carpooling') ?
                            <div className="header-element">
                                <Link to={'/carpooling'}>
                                    <span className="icon devbridge-logo"/>
                                </Link>
                                </div>
                                :
                                <div className="header-element">
                                <span className="icon devbridge-logo" onClick={() => {
                                    window.location.reload();
                                }}/>
                                </div>
                            }
                        
                        <div className = "header-right">
                            <div className="header-element">
                                <NotificationsDropdown notifications={this.props.notifications}/>
                            </div>
                            <div className="header-element" >
                                <Link to='/carpooling'>
                                    <Button
                                        value={"Carpooling"}
                                        styleName={!matchPath( window.location.pathname,'/carpooling') ? "btn-text" : "btn-text -active"}
                                    />
                                </Link>
                            </div>
                            
                                { parseJwt().roles.includes("Manager") &&
                                <div className="header-element" >         
                                        <Link to='/reports'>
                                            <Button
                                                value={"Reports"}
                                                styleName={!matchPath( window.location.pathname,'/reports') ? "btn-text" : "btn-text -active"}
                                            />
                                        </Link>
                            </div>

                                }
                                { parseJwt().roles.includes("Admin") &&
                            <div className="header-element">
                                    
                                        <Link to='/admin'>
                                            <Button
                                                value={"Admin panel"}
                                                styleName={!matchPath( window.location.pathname,'/admin') ? "btn-text" : "btn-text -active"}
                                            />
                                        </Link>
                            </div>
                                    
                                }
                            <div className="header-element">
                                <Link className="profile-picture" to='/settings'>
                                    <Avatar 
                                        className="profile-picture__image" 
                                        name={this.props.userData.fullName} 
                                        round={true} 
                                        size={40} 
                                    />
                                </Link>
                            </div>
                            <div className="header-element">
                                <Link to='/login'>
                                    <Button
                                        value={"Logout"}
                                        styleName={"btn-text"}
                                        onClick={this.props.clearSession}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </header >
        );
    }
}

export default connect(
    state => ({
        notifications: state.notifications.notifications,
        userData: state.userSettings.userData,
    }),
    dispatch =>
        bindActionCreators(
            {
                clearSession
            },
            dispatch
        )
)(Pageheader);
