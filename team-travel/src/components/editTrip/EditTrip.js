import React, { Component } from 'react';
import ModalBoard from "../boards/modal-board/ModalBoard";
import Dropdown from "../layout/dropdown/Dropdown";
import Input from "../layout/input/Input.js"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/tripsListActions';
import CityOptions from '../../constants/CityOptions.js';
import CarOptions from '../../constants/CarOptions.js';
import TripStatus from '../../constants/TripStatus.js';
import {notifyUpdateTrip, notifyCancelTrip, notifyDeclineTrip} from "../../actions/notificationsActions";

class EditTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: props.row,
            isVisibleModal: false,
            isReturnCheckboxChecked: false,
            errors: {
                leavingDate: true,
                leavingTime: true,
                returnDate: true,
                returnTime: true,
                availableSeats: true
            },
        };

        this.handleClose = this.handleClose.bind(this);
        this.cancelTrip = this.cancelTrip.bind(this);
        this.handleEditTrip = this.handleEditTrip.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleLeavingdateChange = this.handleLeavingdateChange.bind(this);
        this.handleReturnDateChange = this.handleReturnDateChange.bind(this);
        this.handleAvailableSeatsChange = this.handleAvailableSeatsChange.bind(this);
        this.handleCarOptionsChange = this.handleCarOptionsChange.bind(this);
        this.handleLeavingTimeChange = this.handleLeavingTimeChange.bind(this);
        this.handleReturnTimeChange = this.handleReturnTimeChange.bind(this);
        this.handleReturnInputCheck = this.handleReturnInputCheck.bind(this);
        this.checkPassengers = this.checkPassengers.bind(this);
        this.findError = this.findError.bind(this);
        this.leaveTrip = this.leaveTrip.bind(this);
    }

    async leaveTrip (){
        let succeeded = this.props.handleEditTrip({
            trip: this.props.row,
            passenger:{
                tripId: this.props.row.id,
                userId: this.props.userData.id,
                fullName: this.props.userData.fullName
            },
            isLeaving: true
        });
        if (succeeded) {
            this.props.notifyDeclineTrip(this.state.row.id);
        }
        this.setState({
            isVisibleModal: false
        });

    }

    findError() {
        let todayDate = new Date();
        let inputLeavingDate = new Date(String(this.state.row.date + "T" + this.state.time));
        let inputReturnDate = new Date(String(this.state.row.dateOfReturn + "T" + this.state.row.timeOfReturn));
        let todayDateNoTime = new Date().setHours(0, 0, 0, 0);
        let inputLeavingDateNoTime = new Date(this.state.row.date).setHours(0, 0, 0, 0);
        let inputReturnDateNoTime = new Date(this.state.row.dateOfReturn).setHours(0, 0, 0, 0);

        this.setState({
            errors: {
                ...this.state.errors,
                leavingDate: !(this.state.row.date === "" // not empty
                    || inputLeavingDateNoTime < todayDateNoTime), // not the date from the past

                leavingTime: !(this.state.row.time === "" // not empty
                    || ((todayDateNoTime === inputLeavingDateNoTime) && inputLeavingDate <= todayDate)), // if date is today, time isn't from the past

                availableSeats: !!this.state.row.availableSeats && !(Number(this.state.row.availableSeats) < 0) && Number.isInteger(Number(this.state.row.availableSeats))
            }
        }, () => {
            if (this.state.isReturnCheckboxChecked) {
                this.setState({
                    errors: {
                        ...this.state.errors,
                        returnDate: !(!this.state.row.dateOfReturn // not empty
                            || inputReturnDateNoTime < inputLeavingDateNoTime // not sooner than leaving date
                            || inputReturnDateNoTime < todayDateNoTime), // not the date from the past

                        returnTime: !(!this.state.row.timeOfReturn // not empty
                            || ((inputLeavingDateNoTime === inputReturnDateNoTime) && (inputReturnDate <= inputLeavingDate))), // if dates are the same, time isn't from the past
                    }
                }, () => {
                    this.handleEditTrip();
                })
            } else {
                this.handleEditTrip();
            }
        });
    }

    cancelTrip = async () => {
        let succeeded = await this.props.handleEditTrip({
            trip: {
                id: this.props.row.id,
                driverId: this.props.row.driverID,
                driver: this.props.row.driver,
                origin: this.props.row.origin,
                destination: this.props.row.destination,
                leavingDate: this.props.row.leavingDate,
                returnDate: this.props.row.returnDate,
                maxSeats: this.props.row.maxSeats,
                carPlate: this.props.row.carPlate,
                carType: this.props.row.carType,
                status: TripStatus.CANCELED,
                comments: this.props.row.comments,
                passengers: this.props.row.passengers,
            }
        });
        if(succeeded) {
            this.props.notifyCancelTrip(this.state.row.id);
        }
        this.setState({
            isVisibleModal: false
        });
    }

    checkPassengers = () => {
        if (Array.isArray(this.state.row.passengers) && this.state.row.passengers.length) {
            return "There are passengers who have joined this trip"
        }
    }

    componentDidUpdate(previousProps) {
        if (previousProps.open !== this.props.open) {
            this.setState({
                isVisibleModal: true,
                row: this.props.row,
                isReturnCheckboxChecked: !!this.props.row.returnDate
            });
        }
    }

    handleClose() {
        this.setState({
            isVisibleModal: !this.state.isVisibleModal,
            row: {},
            isReturnCheckboxChecked: false,
            errors: {
                leavingDate: true,
                leavingTime: true,
                returnDate: true,
                returnTime: true,
                availableSeats: true
            }
        });
    }

    handleEditTrip = () => {
        if (!Object.values(this.state.errors).includes(false)) {
            let succeeded = this.props.handleEditTrip({
                trip: {
                    id: this.state.row.id,
                    driverId: this.state.row.driverID,
                    origin: this.state.row.destination === CityOptions[1] ? CityOptions[2] : CityOptions[1],
                    destination: this.state.row.destination,
                    leavingDate: this.state.row.date + "T" + this.state.row.time,
                    returnDate: !this.state.row.dateOfReturn ? null : (this.state.row.dateOfReturn + "T" + this.state.row.timeOfReturn),
                    maxSeats: (Number(this.state.row.availableSeats) + (!!this.state.row.passengers.length ? this.state.row.passengers.length : 0)),
                    carPlate: this.state.row.carPlate === CarOptions[2] ? null : this.state.row.carPlate,
                    carType: this.state.row.carPlate === CarOptions[2] ? CarOptions[2] : CarOptions[1],
                    status: this.state.row.status,
                    comments: this.state.row.comments,
                    passengers: this.state.row.passengers,
                }
            });
            if (succeeded) {
                this.props.notifyUpdateTrip(this.state.row.id);
            }
            this.setState({
                isVisibleModal: false
            });
        }
    };

    handleCommentChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                comments: e.target.value
            }
        });
    }

    handleDestinationChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                destination: e.target.value
            }
        });
    }
    handleLeavingdateChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                date: e.target.value
            }
        });
    }

    handleLeavingTimeChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                time: e.target.value
            }
        });
    }

    handleReturnTimeChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                timeOfReturn: e.target.value
            }
        });
    }

    handleReturnDateChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                dateOfReturn: e.target.value
            }
        });
    }

    handleAvailableSeatsChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                availableSeats: e.target.value
            },
        });
    }

    handleCarOptionsChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                carPlate: e.target.value
            }
        });
    }

    handleReturnInputCheck() {
        const dateToBeCleared = '2000-01-01';
        const timeToBeCleared = '00:00';
        this.setState({
            isReturnCheckboxChecked: !this.state.isReturnCheckboxChecked,
            row: {
                ...this.state.row,
                dateOfReturn: dateToBeCleared,
                timeOfReturn: timeToBeCleared
            },
            errors: {
                ...this.state.errors,
                returnDate: true,
                returnTime: true,
            }
        }, () => this.setState({
            row: {
                ...this.state.row,
                dateOfReturn: '',
                timeOfReturn: ''
            },
        }));
    };

    render() {

        const modal = (
            <div>
                <form id="editFormId">
                    <div className="row">
                        <div className="col-s-12">
                            <Dropdown
                                title="Where are you going to"
                                options={Object.values(CityOptions)}
                                onChange={this.handleDestinationChange}
                                name="destination"
                                id="destination_id"
                                value={this.state.row.destination === CityOptions[1] ? CityOptions[1] : CityOptions[2]}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-s-6">
                            <Input
                                title={"When are you leaving *"}
                                input={{
                                    type: "date",
                                    name: "leavingDate",
                                    id: "leavingDate_id",
                                    placeholder: "leavingDate...",
                                    onChange: this.handleLeavingdateChange,
                                    value: this.state.row.date,
                                    required: true
                                }}
                                icon={"icon calendar"}
                                errorList={{ leavingDate: this.state.errors.leavingDate }}
                            />
                        </div>
                        <div className="col-s-6">
                            <Input
                                title={'\u00A0'}
                                input={{
                                    type: "time",
                                    name: "leavingTime",
                                    id: "leavingTime_id",
                                    placeholder: "leavingTime...",
                                    onChange: this.handleLeavingTimeChange,
                                    value: this.state.row.time,
                                    required: true,
                                }}
                                icon={"icon clock"}
                                errorList={{ leavingTime: this.state.errors.leavingTime }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-s-6">
                            <Input
                                title={'Return'}
                                checkbox={true}
                                checkboxChecked={this.state.isReturnCheckboxChecked}
                                input={{
                                    type: "date",
                                    name: "returnDate",
                                    id: "returnDate_id",
                                    placeholder: "returnDate...",
                                    onChange: this.handleReturnDateChange,
                                    value: this.state.row.dateOfReturn,
                                }}
                                onCheck={this.handleReturnInputCheck}
                                icon={"icon calendar"}
                                errorList={{ returnDate: this.state.errors.returnDate }}
                            />
                        </div>
                        <div className="col-s-6">
                            <Input
                                title={'\u00A0'}
                                input={{
                                    type: "time",
                                    name: "returnTime",
                                    id: "returnTime_id",
                                    placeholder: "returnTime...",
                                    onChange: this.handleReturnTimeChange,
                                    value: this.state.row.timeOfReturn,
                                    disabled: !this.state.isReturnCheckboxChecked,
                                }}
                                icon={"icon clock"}
                                errorList={{ returnTime: this.state.errors.returnTime }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-s-6">
                            <Input
                                title={'Available seats'}
                                input={{
                                    type: "number",
                                    name: "availableSeats",
                                    id: "availableSeats_id",
                                    onChange: this.handleAvailableSeatsChange,
                                    defaultValue: this.state.row.availableSeats,
                                    required: true
                                }}
                                tooltipText={this.checkPassengers()}
                                errorList={{ availableSeats: this.state.errors.availableSeats }}
                            />
                        </div>
                        <div className="col-s-6">
                            <Dropdown
                                title="What car will you drive"
                                options={!!this.props.userData.carPlates && this.props.userData.carPlates.length > 0 ? this.props.userData.carPlates.concat(CarOptions[2]) : [CarOptions[2]]}
                                onChange={this.handleCarOptionsChange}
                                name="carType"
                                id="carType_id"
                                value={!!this.state.row.carPlate ? this.state.row.carPlate : CarOptions[2]}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-s-12">
                            <div className="input">
                                <div className="input__label">
                                    <div className="input__label-left">
                                        <span className="title">Comments</span>
                                    </div>
                                </div>
                                <div className="input__field">
                                    <textarea
                                        id="comments_id"
                                        name="comments"
                                        value={this.state.row.comments}
                                        rows="5"
                                        onChange={this.handleCommentChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );

        if (this.state.row.type === "Driver")
            return (
                <ModalBoard
                    isVisible={this.state.isVisibleModal}
                    headerTitle={"Edit trip"}
                    headerButton={{
                        value: "Cancel Trip",
                        onClick: this.cancelTrip
                    }}
                    innerSection={modal}
                    footerButtonValue={"Save"}
                    footerButtonOnClick={this.findError}
                    form={"editFormId"}
                    cancelOnClick={this.handleClose}
                />
            );
        const modalLeaveTrip = (
            <div className="modal_width">
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Leaving from</b></label>
                        <p>{this.props.row.origin}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>Going to</b></label>
                        <p >{this.props.row.destination}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Leaving on</b></label>
                        <p >{this.props.row.date}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>at</b></label>
                        <p >{this.props.row.time}</p>
                    </div>
                </div>
                {!!this.state.row.returnDate ?
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Returning on</b></label>
                        <p >{this.props.row.dateOfReturn}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>at</b></label>
                        <p >{this.props.row.timeOfReturn}</p>
                    </div>
                </div> : null}
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Driver</b></label>
                        <p>{this.props.row.driver}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>Car</b></label>
                        <p >{!!this.props.row.carPlate ? this.props.row.carPlate : this.props.row.carType}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-6">
                        <label><b>Phone number</b></label>
                        <p >{this.props.row.phoneNumber}</p>
                    </div>
                    <div className="col-s-6">
                        <label><b>Slack ID</b></label>
                        <p >{this.props.row.slackId}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-12">
                        <label><b>Comments</b></label>
                        <p >{this.props.row.comments}</p>
                    </div>
                </div>
            </div>
        );
        return (
            <ModalBoard
                innerSection={modalLeaveTrip}
                isVisible={this.state.isVisibleModal}
                headerTitle={"Leave trip"}
                footerButtonValue={"Leave"}
                footerButtonOnClick={this.leaveTrip}
                cancelOnClick={this.handleClose}
            />
        )
    }
}

export default connect(
    state => ({
        userData: state.userSettings.userData,
        trips: state.listItemsFetch.trips
    }),
    dispatch =>
        bindActionCreators(
            {
                handleEditTrip: actions.updateTrips,
                notifyDeclineTrip,
                notifyCancelTrip,
                notifyUpdateTrip
            },
            dispatch
        )
)(EditTrip);

