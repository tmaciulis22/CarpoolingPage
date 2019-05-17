import React, { Component } from 'react';
import ListTable from './boards/list-table-board/ListTable';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { updateTrips } from '../actions/tripsListActions'
import ModalBoard from './boards/modal-board/ModalBoard';
import { notifyJoinTrip } from "../actions/notificationsActions";

class CarpoolingTripsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: {},
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

    handleModalJoin = async () =>{
        let succeeded = await this.props.updateTrips({
           trip: this.state.row,
           passenger: {
                tripId: this.state.row.id,
                userId: this.props.userData.id,
                fullName: this.props.userData.fullName
            }
        });

        if (succeeded) {
            this.props.notifyJoinTrip(this.state.row.id);
        }
        this.setState({
            isVisibleModalInfo: !this.state.isVisibleModalInfo
        })
    };

    render() {
        const modal = (
            <div className="modal_width">
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Leaving from</b></label>
                        <p>{this.state.row.origin}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>Going to</b></label>
                        <p >{this.state.row.destination}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Leaving on</b></label>
                        <p >{this.state.row.date}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>at</b></label>
                        <p >{this.state.row.time}</p>
                    </div>
                </div>
                {!!this.state.row.returnDate ?
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Returning on</b></label>
                        <p >{this.state.row.dateOfReturn}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>at</b></label>
                        <p >{this.state.row.timeOfReturn}</p>
                    </div>
                </div> : null}
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Driver</b></label>
                        <p>{this.state.row.driver}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>Car</b></label>
                        <p >{!!this.state.row.carPlate ? this.state.row.carPlate : this.state.row.carType}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Phone number</b></label>
                        <p >{this.state.row.phoneNumber}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>Slack ID</b></label>
                        <p >{this.state.row.slackId}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-12">
                        <label><b>Comments</b></label>
                        <p >{this.state.row.comments}</p>
                    </div>
                </div>
            </div>
        );
        return(
            <div>
                <ListTable
                    bodyRows = {this.props.fullyFilteredTrips}
                    onClick = {row => this.handleModalInfo(row)}
                    isLoading = {this.props.isFetchInProgress}
                    error = {this.props.errorFetch}
                    currentUser = {this.props.userData}
                    border = {this.props.border}
                />

                <ModalBoard
                    isVisible = {this.state.isVisibleModalInfo}
                    headerTitle = {"Join trip"}
                    innerSection = {modal}
                    footerButtonValue = {"Join"}
                    footerButtonOnClick = {this.handleModalJoin}
                    cancelOnClick = {this.handleModalInfo}
                />
            </div>
        );
    }
}

export default connect(
    state => ({
        fullyFilteredTrips: state.listItemsFetch.fullyFilteredTrips,
        isFetchInProgress: state.listItemsFetch.isFetchInProgress,
        userData: state.userSettings.userData,
        errorFetch: state.listItemsFetch.errorFetch,
    }),
    dispatch =>
        bindActionCreators(
            {
                updateTrips,
                notifyJoinTrip
            },
            dispatch
        )
)(CarpoolingTripsTable);