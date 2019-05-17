import React, { Component } from 'react';
import Pageheader from '../../components/layout/PageHeader/Pageheader';
import Button from '../../components/layout/Button/Button';
import "./CarpoolingStyle.scss"
import CarpoolingFiltering from '../../components/boards/carpooling-filtering/CarpoolingFiltering';
import Calendar from '../../components/calendar/CalendarComponent';
import CarpoolingTripsTable from '../../components/CarpoolingTripsTable';
import AddTrip from '../../components/addTrip/AddTrip';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { fetchUserData } from "../../actions/userSettingsActions";
import { fetchTrips } from '../../actions/tripsListActions';

class CarpoolingPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isVisibleModal: false,
            trips: this.props.trips,
            datesForCalendar: [],
        };
        this.props.fetchTrips({filterByDate: new Date(), filterOutCanceledTrips: true});
        this.props.fetchUserData();
        this.handleModalVisibility = this.handleModalVisibility.bind(this);
        this.prepareDateForCalendar = this.prepareDateForCalendar.bind(this);
        this.checkForAddError = this.checkForAddError.bind(this);
        this.checkForJoinError = this.checkForJoinError.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.setState({trips: this.props.trips}, this.prepareDateForCalendar)
        }
    }

    componentDidMount() {
        this.prepareDateForCalendar();
    }

    prepareDateForCalendar() {
        let unstructuredDates = this.state.trips.map(({ date }) => { return date });
        
        const datesAsKeys = unstructuredDates.reduce((times, date) => {
            const key = date;

            times[key] = (times[key] || 0) + 1;

            return times;
        }, []);

        let dates=[];
       for (let key in datesAsKeys){
            if (datesAsKeys.hasOwnProperty(key)) {
                let dateParts = key.split('-');
                dates.push({
                    travelDate: new Date(dateParts[0], dateParts[1]-1, dateParts[2]),
                    travelCount: datesAsKeys[key]
                });
            }
       }
        this.setState({datesForCalendar: dates})
    }

    handleModalVisibility() {
        this.setState({isVisibleModal: !this.state.isVisibleModal});
    }

    checkForAddError(){
        if(!!this.props.errorAdd) {
            return (
                <div>
                    <div className="carpool-header__errorMessage">
                        {this.props.errorAdd}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    checkForJoinError(){
        if(!!this.props.errorJoin) {
            return (
                <div>
                    <div className="errorMessage">
                        {this.props.errorJoin}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {

        return (
            <div>
                <Pageheader />
                <div className="container">
                    <div className="carpool-header__layout">
                        <h1 >Carpooling</h1>
                        <div className="carpool-header__right-side">
                            {this.checkForAddError()}
                            <Button
                                value = {"Add trip"}
                                onClick={this.handleModalVisibility}
                            />
                            <AddTrip open={this.state.isVisibleModal} />
                        </div>
                    </div>
                    <div className="row">
                        <div className ="column-7 ">
                            <Calendar
                                dates = { this.state.datesForCalendar }
                            />
                        </div>
                        <div className="column-4">
                            <CarpoolingFiltering
                                border={true}
                            />
                        </div>
                        <div className="column-12">
                            {this.checkForJoinError()}
                            <CarpoolingTripsTable
                                border={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        trips: state.listItemsFetch.partiallyFilteredTrips,
        errorAdd: state.listItemsFetch.errorAddTrip,
        errorJoin: state.listItemsFetch.errorUpdate,
    }),
    dispatch =>
        bindActionCreators(
            {
                fetchUserData,
                fetchTrips,
            },
            dispatch
        )
)(CarpoolingPage);