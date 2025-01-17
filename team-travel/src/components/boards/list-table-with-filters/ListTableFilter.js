import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/table-board-styles.scss';
import labels from './table-board-labels.json';
import Button from '../../layout/Button/Button';
import Dropdown from '../../layout/dropdown/Dropdown';
import Input from '../../layout/input/Input';
import TRIP_STATUS from '../../../constants/TripStatus';
import USER_TYPE from '../../../constants/TripUserType';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFilters } from '../../../actions/tripsListActions';
import CITY_OPTIONS from './../../../constants/CityOptions';
import DatetimePicker from './../../layout/DatetimePicker/DatetimePicker';
import moment from 'moment';

class ListTableFilter extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstIndex: 0,
            lastIndex: ListTableFilter.PAGE_SIZE,
            currentPage: 1,
            lastPage: (!!this.props.bodyRows ? 
                            this.getActiveOrCompletedTrips().length === 0 ? 1 
                            : 
                            Math.ceil(
                                this.getActiveOrCompletedTrips().length / ListTableFilter.PAGE_SIZE
                            )
                    : 1),
            bodyRows: (!!this.props.bodyRows ? this.getActiveOrCompletedTrips() : []),
            type: "",
            destination: "",
            origin: "",
            direction: "",
            passengers: "",
            fromDate: "",
            toDate: "",
        };
        this.getActiveOrCompletedTrips = this.getActiveOrCompletedTrips.bind(this);
        this.filterRows = this.filterRows.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleDirectionChange = this.handleDirectionChange.bind(this);
        this.handlePassengersChange = this.handlePassengersChange.bind(this);
        this.handleFromDateChange = this.handleFromDateChange.bind(this);
        this.handleToDateChange = this.handleToDateChange.bind(this);
        this.handleSkipToFirst = this.handleSkipToFirst.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleSkipToLast = this.handleSkipToLast.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.checkIfValidFromDate = this.checkIfValidFromDate.bind(this);
        this.checkIfValidToDate = this.checkIfValidToDate.bind(this);
    }

    static PAGE_SIZE = 5;
    static filters = ["type", "destination", "passengers", "fromDate", "toDate"];

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.setState({
                firstIndex: 0,
                lastIndex: ListTableFilter.PAGE_SIZE,
                currentPage: 1,
                lastPage: (!!this.props.bodyRows ? 
                    this.getActiveOrCompletedTrips().length === 0 ? 1 
                    : 
                    Math.ceil(
                        this.getActiveOrCompletedTrips().length / ListTableFilter.PAGE_SIZE
                    )
                : 1),
                bodyRows: (!!this.props.bodyRows ? this.getActiveOrCompletedTrips() : []),
                type: "",
                destination: "",
                origin: "",
                direction: "",
                passengers: "",
                fromDate: "",
                toDate: "",
            })  
        }
    }

    getActiveOrCompletedTrips(){
        return (this.props.bodyRows.filter(row => 
            this.props.isActive ? row.status === TRIP_STATUS.ACTIVE : row.status === TRIP_STATUS.COMPLETED 
        ));
    }

    filterRows(filterType, newValue) {
        let filteredRows = !!this.props.bodyRows ? 
            this.getActiveOrCompletedTrips()
        : [];

        ListTableFilter.filters.forEach(
            filterBy => {
                let filterValue = (filterBy === filterType ? newValue : this.state[filterBy]);
                
                if(filterValue){
                    switch(filterBy){
                        case "passengers":
                            filteredRows = filteredRows.filter(row =>
                                row[filterBy].map(pass => pass.fullName).join(', ').toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
                            );
                            break;
                        case "fromDate":
                            filteredRows = filteredRows.filter(row =>
                                moment(row.date).isSameOrAfter(moment(filterValue), 'day') 
                            );
                            break;
                        case "toDate":
                            filteredRows = filteredRows.filter(row =>
                                moment(row.date).isSameOrBefore(moment(filterValue), 'day') 
                            );     
                            break;
                        default:
                            filteredRows = filteredRows.filter(row =>
                                row[filterBy] === filterValue
                            );
                    }
                }
            }
        );

        let newDirection = this.state.direction; 
        if(filterType === "destination"){
            if(newValue === CITY_OPTIONS[1]) {
                newDirection = labels.directions[2];
            } else if (newValue === CITY_OPTIONS[2]) {
                newDirection = labels.directions[1];
            } else {
                newDirection = labels.directions[0]
            }
        }

        this.setState(
            {
                firstIndex: 0,
                lastIndex: ListTableFilter.PAGE_SIZE,
                currentPage: 1,
                [filterType]: newValue,
                direction: newDirection,
                lastPage:  (filteredRows.length === 0 ? 
                                1 : 
                                Math.ceil(filteredRows.length / ListTableFilter.PAGE_SIZE)
                            ),
                bodyRows: filteredRows,
            }
        )
    }

    handleTypeChange(e) {
        if(e.target.value === labels.types[0]){
            this.filterRows("type", "");
        }else{
            this.filterRows("type", e.target.value);
        }
    }

    handleDirectionChange(e) {
        if(e.target.value === labels.directions[0]){
            this.filterRows("destination", "");
        }else{
            this.filterRows("destination", e.target.value.split(' ')[3]);
        }
    }

    handlePassengersChange(e) {
        this.filterRows("passengers", e.target.value);
    }

    handleFromDateChange(date) {
        typeof date === "string" || 
        this.filterRows("fromDate", date.toDate());
    }

    handleToDateChange(date) {
        typeof date === "string" ||
        this.filterRows("toDate", date.toDate());
    }

    handleSkipToFirst() {
        this.setState(
            {
                currentPage: 1,
                firstIndex: 0,
                lastIndex: ListTableFilter.PAGE_SIZE
            }
        );
    }

    handlePreviousClick() {
        this.setState(
            {
                currentPage: this.state.currentPage - 1,
                firstIndex: this.state.firstIndex - ListTableFilter.PAGE_SIZE,
                lastIndex: this.state.lastIndex - ListTableFilter.PAGE_SIZE
            }
        );
    }

    handleNextClick() {
        this.setState(
            {
                currentPage: this.state.currentPage + 1,
                firstIndex: this.state.firstIndex + ListTableFilter.PAGE_SIZE,
                lastIndex: this.state.lastIndex + ListTableFilter.PAGE_SIZE
            }
        );
    }

    handleSkipToLast() {
        this.setState(
            {
                currentPage: this.state.lastPage,
                firstIndex: (this.state.lastPage - 1) * ListTableFilter.PAGE_SIZE,
                lastIndex: this.state.lastPage * ListTableFilter.PAGE_SIZE
            }
        );
    }

    resolveErrorMessage(error, isLoading){
        let message;

        if(!!error) {
            message = error;
        } else if (isLoading) {
            message = "Trip information is loading...";
        } else {
            message = "There are no trips to display."
        }

        return message;
    }

    generateInputDataList(rows){
        let uniquePassengers = [];

        for(let row of rows){
            for(let passenger of row.passengers){
                uniquePassengers.push(passenger.fullName);
            }
        }
        uniquePassengers = Array.from(new Set(uniquePassengers));

        return (
            <datalist id={"passengers" + Number(this.props.isActive)}>
                {uniquePassengers.map((passenger, index) =>
                    <option key={index} value={passenger} />
                )}
            </datalist>
        );
    }
    
    checkIfValidFromDate(current){
        return !!this.state.toDate ? current.isSameOrBefore( this.state.toDate, 'day' ) : true;
    }

    checkIfValidToDate(current){
        return !!this.state.fromDate ? current.isSameOrAfter( this.state.fromDate, 'day' ) : true;
    }

    renderHead(){
        let alwaysTrueErrorList = {
            noError : true
        }
        return(
            <thead className="table-board__table-head">
                <tr className="table-board__row">
                    <td className="table-board__item"> 
                        <Dropdown 
                            name={"type"}
                            title={labels.typeTitle}
                            options={labels.types}
                            onChange={this.handleTypeChange}
                            value={this.state.type}
                        />
                    </td> 
                    <td className="table-board__item"> 
                        <Dropdown 
                            name={"direction"}
                            title={labels.directionTitle}
                            options={labels.directions}
                            onChange={this.handleDirectionChange}
                            value={this.state.direction}
                        />
                    </td>
                    <td className="table-board__item"> 
                        <Input 
                            input={{
                                name:"passenger",
                                type: "search",
                                placeholder: labels.inputPlaceholder,
                                onChange: this.handlePassengersChange,
                                list: "passengers" + Number(this.props.isActive),
                                value: this.state.passengers
                            }}
                            title={labels.passengersTitle}
                            icon={labels.searchIcon}
                            errorList={alwaysTrueErrorList}
                        />
                        {this.generateInputDataList(this.state.bodyRows)}
                    </td> 
                    <td className="table-board__item"> 
                        <DatetimePicker 
                            title={labels.fromTitle}
                            errorList={alwaysTrueErrorList}
                            input={{
                                name: "fromDate",
                                id: !!this.props.isActive ? "fromDate_id1" : "fromDate_id2",
                                placeholder: "mm/dd/yyyy",
                                autoComplete: "off"
                            }}
                            value={this.state.fromDate}
                            onChange={this.handleFromDateChange}
                            isValidDate={this.checkIfValidFromDate}
                            timeFormat={false}
                            closeOnSelect={true}
                        />
                    </td> 
                    <td className="table-board__item"> 
                        <DatetimePicker 
                            title={labels.toTitle}
                            errorList={alwaysTrueErrorList}
                            input={{
                                name: "toDate",
                                id: !!this.props.isActive ? "toDate_id1" : "toDate_id2",
                                placeholder: "mm/dd/yyyy",
                                autoComplete: "off"
                            }}
                            value={this.state.toDate}
                            onChange={this.handleToDateChange}
                            isValidDate={this.checkIfValidToDate}
                            timeFormat={false}
                            closeOnSelect={true}
                        />
                    </td>
                    {this.props.isActive && (<td className={"table-board__item"} />) }
                </tr>
            </thead>
        );
    }

    renderBody(){
        if(this.state.bodyRows.length === 0){
            let message = this.resolveErrorMessage(this.props.error, this.props.isLoading);

            return(
                <tr className="table-board__row">
                    <td className="table-board__item -center" colSpan="6">
                        <span className="generic-text" align="center">{message}</span>
                    </td>
                </tr>
            );
        }

        let body = this.state.bodyRows.slice(this.state.firstIndex, this.state.lastIndex).map(
            row => {
                return(
                    <tr className="table-board__row" key={row.id}>
                        <td className="table-board__item" >
                            <span className="generic-text">{row.type}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">From {row.origin} to {row.destination}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">
                                {row.passengers.map(pass => pass.fullName).join(", ")}
                            </span>
                        </td>
                        <td className="table-board__item -right" colSpan="2">
                            <span className="generic-text">{row.time + ' | ' + row.date}</span>
                        </td>
                        {
                            this.props.isActive 
                            &&  
                            <td className={"table-board__item -center"} >
                                <span className="generic-text">
                                    <Button 
                                        value={row.type === USER_TYPE[1] ? labels.leaveButtonText : labels.buttonText} 
                                        onClick={() => this.props.onClick(row)} 
                                        styleName="btn-bordered -light"
                                    />
                                </span>
                            </td>
                        }
                    </tr>
                );
            }
        );

        return body;
    }

    render() {
        return(
            <div className={this.props.border ? "table-board board-container" : "table-board board-container__borderless"}>
                <div className="table-board__content">
                    <table className="table-board__table">
                        {this.renderHead()}
                        <tbody className="table-board__table-body">
                            {this.renderBody()} 
                        </tbody>
                    </table>
                </div>
                <div className="table-board__footer">
                    <div className="table-board--footer-left"></div>
                    <div className="table-board--footer-right">
                        <div className="pagination">
                            <Button 
                                styleName="btn-bordered -light icon skip-gray reverse" 
                                isDisabled={this.state.currentPage === 1}
                                onClick={this.handleSkipToFirst}
                            />
                            <Button 
                                styleName="btn-bordered -light icon arrow-gray reverse" 
                                isDisabled={this.state.currentPage === 1} 
                                onClick={this.handlePreviousClick}
                            />
                                <span className="generic-text">{this.state.currentPage} of {this.state.lastPage}</span>
                            <Button 
                                styleName="btn-bordered -light icon arrow-gray" 
                                isDisabled={this.state.currentPage === this.state.lastPage}
                                onClick={this.handleNextClick}
                            />
                            <Button 
                                styleName="btn-bordered -light icon skip-gray" 
                                isDisabled={this.state.currentPage === this.state.lastPage} 
                                onClick={this.handleSkipToLast}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ListTableFilter.propTypes = {
    bodyRows: PropTypes.arrayOf(
        PropTypes.shape({
            "id": PropTypes.number,
            "type": PropTypes.string,
            "origin": PropTypes.string,
            "destination": PropTypes.string,
            "passengers": PropTypes.arrayOf(PropTypes.shape({tripId: PropTypes.number, userId: PropTypes.number, fullName: PropTypes.string})),
            "date": PropTypes.date,
            "time": PropTypes.string,
            "isCompleted": PropTypes.bool,
        })
    ),
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    isLoading: PropTypes.bool,
    error: PropTypes.string
}

export default connect(
    state => ({
        isFetchInProgress: state.listItemsFetch.isFetchInProgress,
    }),
    dispatch =>
        bindActionCreators(
            {
                clearFilters
            },
            dispatch
        )
) (ListTableFilter);