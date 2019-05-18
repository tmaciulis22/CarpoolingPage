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
import DatetimePicker from './../layout/DatetimePicker/DatetimePicker';
import moment from 'moment';

class EditTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: props.row,
            isVisibleModal: false,
            isReturnCheckboxChecked: false,
            errors: {
                leavingDate: true,
                returnDate: true,
                availableSeats: true
            },
        };

        this.handleClose = this.handleClose.bind(this);
        this.cancelTrip = this.cancelTrip.bind(this);
        this.handleEditTrip = this.handleEditTrip.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleAvailableSeatsChange = this.handleAvailableSeatsChange.bind(this);
        this.handleCarOptionsChange = this.handleCarOptionsChange.bind(this);
        this.handleReturnInputCheck = this.handleReturnInputCheck.bind(this);
        this.handleReturnDatetimeChange = this.handleReturnDatetimeChange.bind(this);
        this.handleLeavingDatetimeChange = this.handleLeavingDatetimeChange.bind(this);
        this.checkIfValidLeavingDate = this.checkIfValidLeavingDate.bind(this);
        this.checkIfValidReturnDate = this.checkIfValidReturnDate.bind(this);
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
        let todayDate = moment().toDate(moment());
        let inputLeavingDate = this.state.row.leavingDate;
        let inputReturnDate = this.state.row.returnDate;

        this.setState({
            errors: {
                ...this.state.errors,
                leavingDate: !(!this.state.row.leavingDate // not empty
                    || !moment(inputLeavingDate).isAfter(todayDate, 'minute')), // not the date from the past

                availableSeats: !!this.state.row.availableSeats && !(Number(this.state.row.availableSeats) < 0) && Number.isInteger(Number(this.state.row.availableSeats))
            }
        }, () => {
            if (this.state.isReturnCheckboxChecked) {
                this.setState( {
                    errors: {
                        ...this.state.errors,
                        returnDate: !(!this.state.row.returnDate // not empty
                            || !moment(inputReturnDate).isAfter(inputLeavingDate, 'minute') // not sooner than leaving date
                            || !moment(inputReturnDate).isAfter(todayDate, 'minute')), // not the date from the past
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
                returnDate: true,
                availableSeats: true
            }
        });
    }

    handleEditTrip = () => {
        if (!Object.values(this.state.errors).includes(false)) {
            const leavingDate = moment(this.state.row.leavingDate).format();
            const returnDate = !!this.state.row.returnDate ? moment(this.state.row.returnDate).format() : null;
            let succeeded = this.props.handleEditTrip({
                trip: {
                    id: this.state.row.id,
                    driverId: this.state.row.driverID,
                    origin: this.state.row.destination === CityOptions[1] ? CityOptions[2] : CityOptions[1],
                    destination: this.state.row.destination,
                    leavingDate: leavingDate,
                    returnDate: returnDate,
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

    handleLeavingDatetimeChange(date){
        typeof date === "string" ||
        this.setState({
            row: {
                ...this.state.row,
                leavingDate: date.toDate(),
            },
            errors: {
                leavingDate: true,
            }
        });
    }

    handleReturnDatetimeChange(date){
        typeof date === "string" ||
        this.setState({
            row: {
                ...this.state.row,
                returnDate: date.toDate(),
            },
            errors: {
                returnDate: true,
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
        const dateToBeCleared = new Date();
        this.setState({
            isReturnCheckboxChecked: !this.state.isReturnCheckboxChecked,
            row: {
                ...this.state.row,
                returnDate: dateToBeCleared,
            },
            errors: {
                ...this.state.errors,
                returnDate: true,
            }
        }, () => this.setState({
            row: {
                ...this.state.row,
                returnDate: ''
            },
        }));
    };

    checkIfValidLeavingDate(current){
        var yesterday = moment().subtract( 1, 'day' );
        return current.isAfter( yesterday, 'day' );
    }

    checkIfValidReturnDate(current){
        return current.isSameOrAfter( moment(this.state.row.leavingDate).toDate(), 'day' );
    }

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
                            <DatetimePicker 
                                title={"When are you leaving *"}
                                errorList={{ leavingDate: this.state.errors.leavingDate}}
                                input={{
                                    name: "leavingDate",
                                    id: "leavingDate_id",
                                    placeholder: "mm/dd/yyyy hh:mm",
                                    required:true,
                                    autoComplete: "off"
                                }}
                                value={moment(this.state.row.leavingDate).toDate()}
                                onChange={this.handleLeavingDatetimeChange}
                                isValidDate={this.checkIfValidLeavingDate}
                                timeFormat={'HH:mm'}
                            />
                        </div>
                        <div className="col-s-6">
                            <DatetimePicker 
                                title={"Return"}
                                checkbox={true}
                                errorList={{ returnDate: this.state.errors.returnDate}}
                                input={{
                                    name: "returnDate",
                                    id: "returnDate_id",
                                    placeholder: "mm/dd/yyyy hh:mm",
                                    required: true,
                                    autoComplete: "off"
                                }}
                                value={!!this.state.row.returnDate ? moment(this.state.row.returnDate).toDate() : null}
                                onChange={this.handleReturnDatetimeChange}
                                onCheck={this.handleReturnInputCheck}
                                isValidDate={this.checkIfValidReturnDate}
                                timeFormat={'HH:mm'}
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

