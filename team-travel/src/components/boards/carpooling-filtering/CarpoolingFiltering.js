import React, { Component } from 'react';
import './styles/carpooling-filtering-styles.scss';
import Input from '../../layout/input/Input';
import Dropdown from '../../layout/dropdown/Dropdown';
import Button from '../../layout/Button/Button';
import labels from './carpooling-filtering-labels.json';
import {connect} from "react-redux";
import * as actions from "../../../actions/tripsListActions";
import {bindActionCreators} from "redux";

class CarpoolingFiltering extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin: "",
            destination: "",
            driver: "",
        };
        this.onChangeOrigin = this.onChangeOrigin.bind(this);
        this.onChangeDestination = this.onChangeDestination.bind(this);
        this.handleDriverFiltering = this.handleDriverFiltering.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
    }

    onChangeOrigin(e) {
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
    }

    onChangeDestination(e) {
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
    }

    generateInputDataList(trips){
        let uniqueDrivers = [ ...new Set(trips.map(trip => trip.driver))];
        return (
            <datalist id="drivers">
                {uniqueDrivers.map((driver, index) =>
                    <option key={index} value={driver} />
                )}
            </datalist>
        );
    };

    handleDriverFiltering(driver) {
        this.setState({
            driver: driver.target.value,
        }, () => {this.props.filterTripsByDriver(this.state.driver)});
    }

    clearFilters(){
        this.setState({
            origin: "",
            destination: "",
            driver: ""
        }, () => {this.props.filterTripsByCity(this.state.origin)});
        this.props.filterTripsByDriver("");
    }

    render() {
        return (
            <div className="carpooling-filtering">
                <div className={this.props.border ? "board-container" : "board-container__borderless"} >
                    <div className="board-header">
                        <span className="board-header__title">{labels.header}</span>
                        <Button
                            styleName={"btn-bordered -light"}
                            value={labels.buttonValue}
                            isDisabled={this.state.origin === "" && this.state.destination === "" && this.state.driver === ""}
                            onClick={this.clearFilters}
                        />
                    </div>
                    <div className="carpooling-filtering__content">
                        <div className="row" >
                            <div className="col-s-12 col-m-12 col-l-12">
                                <Dropdown
                                    title={labels.originTitle}
                                    options={labels.locationOptions}
                                    value={this.state.origin}
                                    onChange={this.onChangeOrigin}
                                />
                                <Dropdown
                                    title={labels.destinationTitle}
                                    options={labels.locationOptions}
                                    value={this.state.destination}
                                    onChange={this.onChangeDestination}
                                />
                                <Input
                                    input={{
                                        type: "search",
                                        placeholder: labels.driverPlaceholder,
                                        onChange: this.handleDriverFiltering,
                                        list: "drivers",
                                        value: this.state.driver
                                    }}
                                    title={labels.driverTitle}
                                    icon={labels.driverIcon}
                                    errorList={{error: true}}
                                />
                                {this.generateInputDataList(this.props.trips)}
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
        trips: state.listItemsFetch.trips
    }),
    dispatch =>
        bindActionCreators(
            {
                filterTripsByCity: actions.filterTripsByCity,
                filterTripsByDate: actions.filterTripsByDate,
                filterTripsByDriver: actions.filterTripsByDriver,
            },
            dispatch
        )
)(CarpoolingFiltering);