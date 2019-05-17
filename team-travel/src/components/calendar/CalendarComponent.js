import React, { Component } from 'react';
import Calendar from 'react-calendar/dist/entry.nostyle';
import './calendar.scss'
import { connect } from "react-redux";
import * as actions from "../../actions/tripsListActions";
import { bindActionCreators } from 'redux';

const CALENDAR_TYPE = "ISO 8601";

class CalendarComponent extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            dates : props.dates,
        };
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props) {
            this.setState({dates: this.props.dates})
        }
    }

    handleOnChange = (date) => {
        this.setState({ date });
    };

    convertDate(dateObj) {
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth()+1;
        let day = dateObj.getDate();

        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return year + '-' + month + '-' + day;
    }

    handleOnClick = (date) =>{
        this.props.filterTripsByDate(this.convertDate(date));
    };
    
    render(){
        return(
            <Calendar
                    calendarType={CALENDAR_TYPE}
                    onChange={this.handleOnChange}
                    onClickDay = {this.handleOnClick}
                    value={this.state.date}
                    tileContent = {({ date, view }) => view === 'month' 
                    && this.state.dates.map((item,index)=> date.getTime() === item.travelDate.getTime()? <span className="travel-count"key={index}>{item.travelCount}</span> : null) }
                    nextLabel = {<div className="icon arrow-blue"/>}
                    prevLabel = {<div className="icon arrow-blue-mirrored "/>}
                    next2Label = {<div className="icon double-arrow-blue"/>}
                    prev2Label = {<div className="icon double-arrow-blue-mirrored"/>}
            />
        );
    }
}


export default connect(
    null,
    dispatch =>
        bindActionCreators(
            {
                filterTripsByDate: actions.filterTripsByDate,
            },
            dispatch
        )
)(CalendarComponent);