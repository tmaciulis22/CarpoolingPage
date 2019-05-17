import React, { Component } from 'react';
import './styles/reports-filter-styles.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { filterTripsByCity,
    filterTripsByDateFrom,
    filterTripsByDateTo,
    filterTripsByDriver,
    filterTripsByCar,
    filterTripsByStatus,
    clearFilters } from '../../../actions/tripsListActions';
import { filterSelectedRows } from '../../../actions/reportsListActions';
import Input from '../../layout/input/Input';
import Dropdown from '../../layout/dropdown/Dropdown';
import labels from './reports-filter-labels.json';
import Button from './../../layout/Button/Button';
import DatetimePicker from './../../layout/DatetimePicker/DatetimePicker';
import moment from 'moment';

class ReportsFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin: "",
            destination: "",
            fromDate: moment().subtract(1, 'months').toDate(),
            toDate: moment().toDate(),
            driver: "",
            carType: "",
            status: "",
            buttonDisabled: false
        };
        this.generateInputDataList = this.generateInputDataList.bind(this);
        this.handleFiltering = this.handleFiltering.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.handleFromDateChange = this.handleFromDateChange.bind(this);
        this.handleToDateChange = this.handleToDateChange.bind(this);
        this.checkIfValidFromDate = this.checkIfValidFromDate.bind(this);
        this.checkIfValidToDate = this.checkIfValidToDate.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isFetchInProgress && !this.props.isFetchInProgress) {
            this.props.clearFilters();
            this.props.filterTripsByCity(this.state.origin);
            this.props.filterTripsByDateFrom(this.state.fromDate);
            this.props.filterTripsByDateTo(this.state.toDate);
            this.props.filterTripsByDriver(this.state.driver);
            this.props.filterTripsByCar(this.state.carType);
            this.props.filterTripsByStatus(this.state.status);
        }
        this.props.filterSelectedRows(this.props.filteredTrips);
    }

    generateInputDataList(trips) {
        let uniqueDrivers = [ ...new Set(trips.map(trip => trip.driver))];
        return (
            <datalist id="drivers">
                {uniqueDrivers.map((driver, index) =>
                    <option key={index} value={driver} />
                )}
            </datalist>
        );
    };

    handleFiltering(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
            buttonDisabled: false
        });
        switch(name) {
            case 'fromDate':
                this.props.filterTripsByDateFrom(value);
                break;
            case 'toDate':
                this.props.filterTripsByDateTo(value);
                break;
            case 'driver':
                this.props.filterTripsByDriver(value);
                break;
            case 'carType':
                this.props.filterTripsByCar(value !== "All" ? value : "");
                break;
            case 'destination':
                if(e.target.value === "All"){
                    this.setState({
                        origin: "",
                        destination: ""
                    }, () => {this.props.filterTripsByCity(this.state.origin)});
                } 
                else{
                    this.setState({
                        origin: this.state.destination !== "" ? this.state.destination : labels.locationOptions.filter(option => option !== "All" && option !== e.target.value)[0],
                        destination: e.target.value
                    }, () => {this.props.filterTripsByCity(this.state.origin)});
                }
                break;
            case 'origin':
                if(e.target.value === "All"){
                    this.setState({
                        destination: "",
                        origin: ""
                    }, () => {this.props.filterTripsByCity(this.state.origin)});
                }
                else{
                    this.setState({
                        destination: this.state.origin !== "" ? this.state.origin : labels.locationOptions.filter(option => option !== "All" && option !== e.target.value)[0],
                        origin: e.target.value
                    }, () => {this.props.filterTripsByCity(this.state.origin)});
                }
                break;
            default:
                this.props.filterTripsByStatus(value !== "All" ? value : "");
                break;
        }
    }

    handleFromDateChange(date){
        typeof date !== "string" && 
        this.props.filterTripsByDateFrom(date.toDate()) &&
        this.setState({
            fromDate: date.toDate(),
            buttonDisabled: false
        });
    }

    handleToDateChange(date){
        typeof date !== "string" &&
        this.props.filterTripsByDateTo(date.toDate()) &&
        this.setState({
            toDate: date.toDate(),
            buttonDisabled: false
        });
    }

    checkIfValidFromDate(current){
        return current.isSameOrBefore( this.state.toDate, 'day' );
    }

    checkIfValidToDate(current){
        return current.isSameOrAfter( this.state.fromDate, 'day' );
    }

    clearFilters(){
        const dateToBeCleared = new Date();
        this.setState({
            origin: "",
            destination: "",
            fromDate: dateToBeCleared,
            toDate: dateToBeCleared,
            driver: "",
            carType: "",
            status: "",
            buttonDisabled: true
        }, () => {this.setState({
            fromDate: "",
            toDate: "",
        }, () => {this.props.clearFilters()})});
    }

    render() {
        const errorList = {
            error: true
        };

        return (
            <div className="reports-filter" >
                <div className="board-container" >
                    <div className="board-header" >
                        <span className="board-header__title" >{labels.boardHeader}</span>
                        <Button
                            styleName={"btn-bordered -light"}
                            value={labels.buttonValue}
                            isDisabled={this.state.buttonDisabled}
                            onClick={this.clearFilters}
                        />
                    </div>
                    <div className="reports-filter__content" >
                        <div className="row" >
                            <div className="col-s-6 col-m-3 col-l-2" >
                                <Dropdown
                                    name="origin"
                                    title={labels.originTitle}
                                    options={labels.locationOptions}
                                    value={this.state.origin}
                                    onChange={this.handleFiltering}
                                />
                            </div>
                            <div className="col-s-6 col-m-3 col-l-2" >
                                <Dropdown
                                    name="destination"
                                    title={labels.destinationTitle}
                                    options={labels.locationOptions}
                                    value={this.state.destination}
                                    onChange={this.handleFiltering}
                                />
                            </div>
                            <div className="col-s-12 col-m-6 col-l-4">
                                <DatetimePicker 
                                    title={labels.fromDateTitle}
                                    errorList={errorList}
                                    input={{
                                        name: "fromDate",
                                        id: "fromDate_id",
                                        placeholder: "mm/dd/yyyy",
                                        autoComplete: "off"
                                    }}
                                    value={this.state.fromDate}
                                    onChange={this.handleFromDateChange}
                                    isValidDate={this.checkIfValidFromDate}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                />
                            </div>
                            <div className="col-s-12 col-m-6 col-l-4">
                                <DatetimePicker 
                                    title={labels.toDateTitle}
                                    errorList={errorList}
                                    input={{
                                        name: "toDate",
                                        id: "toDate_id",
                                        placeholder: "mm/dd/yyyy",
                                        autoComplete: "off"
                                    }}
                                    value={this.state.toDate}
                                    onChange={this.handleToDateChange}
                                    isValidDate={this.checkIfValidToDate}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                />
                            </div>
                            <div className="col-s-12 col-m-6 col-l-4" >
                                <Input
                                    input={{
                                        name: "driver",
                                        type: "search",
                                        placeholder: labels.driverPlaceholder,
                                        list: "drivers",
                                        onChange: this.handleFiltering,
                                        value: this.state.driver
                                    }}
                                    title={labels.driverTitle}
                                    icon={labels.driverIcon}
                                    errorList={errorList}
                                />
                                {this.generateInputDataList(this.props.filteredTrips)}
                            </div>
                            <div className="col-s-12 col-m-6 col-l-4" >
                                <Dropdown
                                    name="carType"
                                    title={labels.carTitle}
                                    options={labels.carOptions}
                                    onChange={this.handleFiltering}
                                    value={this.state.carType}
                                />
                            </div>
                            <div className="col-s-12 col-m-6 col-l-4" >
                                <Dropdown
                                    name="status"
                                    title={labels.statusTitle}
                                    options={labels.statusOptions}
                                    onChange={this.handleFiltering}
                                    value={this.state.status}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        filteredTrips: state.listItemsFetch.fullyFilteredTrips,
        isFetchInProgress: state.listItemsFetch.isFetchInProgress,
    }),
    dispatch =>
        bindActionCreators(
            {
                filterTripsByCity,
                filterTripsByDateFrom,
                filterTripsByDateTo,
                filterTripsByDriver,
                filterTripsByCar,
                filterTripsByStatus,
                clearFilters,
                filterSelectedRows,
            },
            dispatch
        )
)(ReportsFilter);