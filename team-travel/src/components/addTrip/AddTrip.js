import React, { Component } from 'react';
import ModalBoard from "../boards/modal-board/ModalBoard";
import Dropdown from "../layout/dropdown/Dropdown";
import Input from "../layout/input/Input.js"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CarOptions from '../../constants/CarOptions.js';
import CityOptions from '../../constants/CityOptions.js';
import TripStatus from '../../constants/TripStatus';
import * as actions from '../../actions/tripsListActions';
import DatetimePicker from './../layout/DatetimePicker/DatetimePicker';
import moment from 'moment';

class AddTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destination: this.props.userData.mainOffice === CityOptions[1] ? CityOptions[2]: CityOptions[1],
            leavingDate: '',
            returnDate: '',
            availableSeats: 4,
            carPlate: !!this.props.userData.carPlates && this.props.userData.carPlates.length > 0 ? this.props.userData.carPlates[0] : CarOptions[2],
            comments: '',
            isVisibleModal: false,
            errors: {
                leavingDate: true,
                returnDate: true,
                availableSeats: true
            },
            isReturnCheckboxChecked: false
        };

        this.handleClose = this.handleClose.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.findError = this.findError.bind(this);
        this.handleReturnInputCheck = this.handleReturnInputCheck.bind(this);
        this.handleReturnDatetimeChange = this.handleReturnDatetimeChange.bind(this);
        this.handleLeavingDatetimeChange = this.handleLeavingDatetimeChange.bind(this);
        this.checkIfValidLeavingDate = this.checkIfValidLeavingDate.bind(this);
        this.checkIfValidReturnDate = this.checkIfValidReturnDate.bind(this);
    }

    componentDidUpdate(previousProps) {
        if (previousProps.open !== this.props.open) {
            this.setState({ 
                destination: this.props.userData.mainOffice === CityOptions[1] ? CityOptions[2]: CityOptions[1],
                carPlate: !!this.props.userData.carPlates && this.props.userData.carPlates.length > 0 ? this.props.userData.carPlates[0] : CarOptions[2],
                isVisibleModal: true
            });
        }
    }

    handleClose() {
        this.setState({
            isVisibleModal: !this.state.isVisibleModal,
        }, () => {this.clearInput()});
    }

    clearInput() {
        const dateToBeCleared = new Date();
        this.setState({
            destination: this.props.userData.mainOffice === CityOptions[1] ? CityOptions[2]: CityOptions[1],
            leavingDate: dateToBeCleared,
            returnDate: dateToBeCleared,
            availableSeats: 4,
            carPlate: !!this.props.userData.carPlates && this.props.userData.carPlates.length > 0 ? this.props.userData.carPlates[0] : CarOptions[2],
            comments: '',
            errors: {
                leavingDate: true,
                returnDate: true,
                availableSeats: true
            }
        }, () => this.setState({
            leavingDate: '',
            returnDate: '',
        }));
    }

    findError() {
        let todayDate = moment().toDate(moment());
        let inputLeavingDate = this.state.leavingDate;
        let inputReturnDate = this.state.returnDate;
      
        this.setState({
            errors: {
                ...this.state.errors,
                leavingDate: !(!this.state.leavingDate // not empty
                    || moment(inputLeavingDate).isSameOrBefore(todayDate)), // not the date from the past

                availableSeats: !!this.state.availableSeats && !(Number(this.state.availableSeats) < 0) && Number.isInteger(Number(this.state.availableSeats))
            }
        }, () => {
            if (this.state.isReturnCheckboxChecked) {
                this.setState( {
                    errors: {
                        ...this.state.errors,
                        returnDate: !(!this.state.returnDate // not empty
                            || moment(inputReturnDate).isSameOrBefore(inputLeavingDate) // not sooner than leaving date
                            || moment(inputReturnDate).isSameOrBefore(todayDate)), // not the date from the past
                    }
                }, () => {
                    this.submitTrip();
                })
            } else {
                this.submitTrip();
            }
        });
    }

    submitTrip = () => {
        if (!Object.values(this.state.errors).includes(false)) {
            const leavingDate = moment(this.state.leavingDate).format();
            const returnDate = !!this.state.returnDate ? moment(this.state.returnDate).format() : null;
            this.props.handleTripsAdding({
                DriverID: this.props.userData.id,
                Driver: this.props.userData.fullName,
                Origin: this.state.destination === CityOptions[1] ? CityOptions[2] : CityOptions[1],
                Destination: this.state.destination,
                LeavingDate: leavingDate,
                ReturnDate: returnDate,
                MaxSeats: Number(this.state.availableSeats),
                CarPlate: this.state.carPlate === CarOptions[2] ? null : this.state.carPlate,
                CarType: this.state.carPlate === CarOptions[2] ? CarOptions[2] : CarOptions[1],
                Status: TripStatus["ACTIVE"],
                Comments: this.state.comments,
                Passengers: []
            });
            this.setState({
                isVisibleModal: false
            });
            this.clearInput();
        }
    };

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
            errors: {
                availableSeats: true
            }
        });
    };

    handleLeavingDatetimeChange(date){
        typeof date === "string" ||
        this.setState({
            leavingDate: date.toDate(),
            errors: {
                leavingDate: true,
            }
        });
    }

    handleReturnDatetimeChange(date){
        typeof date === "string" ||
        this.setState({
            returnDate: date.toDate(),
            errors: {
                returnDate: true,
            }
        });
    }

    handleReturnInputCheck () {
        const dateToBeCleared = new Date();
        this.setState({
            isReturnCheckboxChecked: !this.state.isReturnCheckboxChecked,
            returnDate: dateToBeCleared,
            errors: {
                ...this.state.errors,
                returnDate: true,
            }
        }, () => this.setState({
            returnDate: '',
        }));
    };

    checkIfValidLeavingDate(current){
        var yesterday = moment().subtract( 1, 'day' );
        return current.isAfter( yesterday );
    }

    checkIfValidReturnDate(current){
        return current.isSameOrAfter( this.state.leavingDate, 'minute' );
    }

    render() {
        const modal = (
            <div>
                 <form id="addFormId">
                <div className="row">
                    <div className="col-s-12">
                        <Dropdown
                            title="Where are you going to"
                            options={Object.values(CityOptions)}
                            onChange={this.handleChange}
                            name="destination"
                            id="destination_id"
                            value={this.state.destination}
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
                            value={this.state.leavingDate}
                            onChange={this.handleLeavingDatetimeChange}
                            isValidDate={this.checkIfValidLeavingDate}
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
                            value={this.state.returnDate}
                            onChange={this.handleReturnDatetimeChange}
                            onCheck={this.handleReturnInputCheck}
                            isValidDate={this.checkIfValidReturnDate}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-6">
                        <Input
                            title={'Available seats *'}
                            input={{
                                type: "number",
                                name: "availableSeats",
                                id: "availableSeats_id",
                                onChange: this.handleChange,
                                value: this.state.availableSeats,
                                min: 1
                            }}                           
                            errorList={{ availableSeats: this.state.errors.availableSeats}}
                        />
                    </div>
                    <div className="col-s-6">
                        <Dropdown
                            title="What car will you drive"
                            options={!!this.props.userData.carPlates && this.props.userData.carPlates.length > 0 ? this.props.userData.carPlates.concat(CarOptions[2]) : [CarOptions[2]]}
                            onChange={this.handleChange}
                            name="carPlate"
                            id="carPlate_id"
                            value={this.state.carPlate}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-s-12">
                        <div className="input">
                            <div className="input__label">
                                <div className="input__label-left">
                                    <span className="title">Comments (optional)</span>
                                </div>
                            </div>
                            <div className="input__field">
                                <textarea
                                    id="comments_id"
                                    name="comments"
                                    value={this.state.comments}
                                    rows="5"
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                </form>
            </div>
        );

        return (
            <ModalBoard
                isVisible={this.state.isVisibleModal}
                headerTitle={"Add trip"}
                headerButton={{
                    value: "Clear",
                    onClick: this.clearInput
                }}
                innerSection={modal}
                footerButtonValue={"Add"}
                footerButtonOnClick={this.findError}
                cancelOnClick={this.handleClose}
            />
        );
    }
}

export default connect(
    state => ({
        trips: state.listItemsFetch.trips,
        userData: state.userSettings.userData,
    }),
    dispatch =>
        bindActionCreators(
            {
                handleTripsAdding: actions.addTrip,
            },
            dispatch
        )
)(AddTrip);

