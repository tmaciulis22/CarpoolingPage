import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUserData } from '../../actions/userSettingsActions';
import Pageheader from '../../components/layout/PageHeader/Pageheader';
import AboutMe from '../../components/boards/about-me/AboutMe';
import ListTable from '../../components/boards/list-table-with-filters/ListTableFilter'
import EditTrip from '../../components/editTrip/EditTrip'
import labels from './user-settings-page-labels.json';
import './user-settings-page.scss';
import { fetchTrips, clearFilters } from "../../actions/tripsListActions";
import { updateUserData } from '../../actions/userSettingsActions';

class UserSettingsPage extends Component {
    constructor(props) {
        super(props);
        this.props.fetchUserData();
        this.props.fetchTrips(false);
        this.state = {
            row: {},
            isVisibleModalInfo: false,
            trips: props.trips.map(trip => {
                if (trip.driverID === this.props.userData.id)
                    trip.type = "Driver";
                else if (trip.passengers.map(pass => pass.userId).includes(this.props.userData.id))
                    trip.type = "Passenger";
                return (trip);
            }).filter(trip => !!trip.type)
        };
        this.handleModalInfo = this.handleModalInfo.bind(this);
        this.checkForLeaveOrEditError = this.checkForLeaveOrEditError.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.setState({
                trips: this.props.trips.map(trip => {
                    if (trip.driverID === this.props.userData.id)
                        trip.type = "Driver";
                    else if (trip.passengers.map(pass => pass.userId).includes(this.props.userData.id))
                        trip.type = "Passenger";
                    return (trip);
                }).filter(trip => !!trip.type)
            });
        }
    }

    handleModalInfo(row) {
        this.setState({
            row: row,
            isVisibleModalInfo: !this.state.isVisibleModalInfo
        });
    }

    checkForLeaveOrEditError(){
        if(!!this.props.errorUpdateTrip) {
            return (
                <div>
                    <div className="sectionHeader__errorMessage">
                        {this.props.errorUpdateTrip}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="userSettingsPage">
                <Pageheader />
                <div className="container">
                    <div className="sectionHeader">
                        <h1>{labels.userSettings}</h1>
                    </div>
                    <AboutMe
                        id={this.props.userData.id}
                        fullName={this.props.userData.fullName}
                        phoneNumber={this.props.userData.phoneNumber}
                        slackId={this.props.userData.slackId}
                        mainOffice={this.props.userData.mainOffice}
                        isDriver={this.props.userData.isDriver}
                        carPlates={this.props.userData.carPlates}
                        password={this.props.userData.password}
                        onSave={this.props.updateUserData}
                        error={this.props.userError}
                    />
                    <div className="sectionHeader">{labels.activeTrips}{this.checkForLeaveOrEditError()}</div>
                    <ListTable
                        border={true}
                        bodyRows={this.state.trips}
                        onClick={this.handleModalInfo}
                        isActive={true}
                        isLoading={this.props.isFetchInProgress}
                        error={this.props.errorFetch}
                    />
                    <EditTrip open={this.state.isVisibleModalInfo}
                        row={this.state.row} />
                    <div className="sectionHeader">{labels.travelHistory}</div>
                    <ListTable
                        border={true}
                        bodyRows={this.state.trips}
                        isActive={false}
                        isLoading={this.props.isFetchInProgress}
                        error={this.props.errorFetch}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        userData: state.userSettings.userData,
        trips: state.listItemsFetch.trips,
        isFetchInProgress: state.listItemsFetch.isFetchInProgress,
        errorFetch: state.listItemsFetch.errorFetch,
        userError: state.userSettings.error,
        errorUpdateTrip: state.listItemsFetch.errorUpdate,
    }),
    dispatch =>
        bindActionCreators(
            {
                fetchTrips,
                clearFilters,
                fetchUserData,
                updateUserData
            },
            dispatch
        )
)(UserSettingsPage);