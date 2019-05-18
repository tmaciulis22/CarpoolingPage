import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUserDataAdmin } from '../../actions/adminPanelActions';
import Pageheader from '../../components/layout/PageHeader/Pageheader';
import UsersListTableFilter from '../../components/boards/users-list-table/UsersListTableFilter';
import UserModal from '../../components/UserModal/UserModal';
import labels from './admin-page-labels.json';
import './admin-page.scss';

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.props.fetchUserDataAdmin(false);        
        this.state = {
            row: {},
            userDataAdmin: this.props.userDataAdmin,
            isVisibleModalInfo: false,
        };
        this.handleModalInfo = this.handleModalInfo.bind(this);
    }

    handleModalInfo(row) {
        this.setState({
            row: row,
            isVisibleModalInfo: !this.state.isVisibleModalInfo
        });
    }

    render() {
        return (
            <div className="adminPage">
                <Pageheader />
                <div className="container">
                    <div className="sectionHeader">
                        <h1>{labels.adminPanel}</h1>
                    </div>
                    <UsersListTableFilter
                        border={true}
                        bodyRows={this.props.userDataAdmin}
                        onClick={this.handleModalInfo}
                        isLoading={this.props.fetchDataInProgress}                  
                    />
                    <UserModal open={this.state.isVisibleModalInfo}
                        row={this.state.row} />
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        userDataAdmin: state.adminPanelUsers.userDataAdmin,
        fetchDataInProgress: state.adminPanelUsers.fetchDataInProgress,        
    }),
    dispatch =>
        bindActionCreators(
            {
                fetchUserDataAdmin,               
            },
            dispatch
        )
)(AdminPage);