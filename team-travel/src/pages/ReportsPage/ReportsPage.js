import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTrips, clearFilters } from '../../actions/tripsListActions';
import Button from '../../components/layout/Button/Button';
import Pageheader from '../../components/layout/PageHeader/Pageheader';
import ReportsFilter from '../../components/boards/reports-filter/ReportsFilter';
import ReportsList from '../../components/boards/reports-list/ReportsList';
import labels from './reports-page-labels.json';
import './reports-page.scss';
import CSVGenerator from './CSVGenerator.js';

class ReportsPage extends Component{
    constructor(props) {
        super(props);
        this.state={
            isVisibleModal: false,
        };

        this.props.fetchItems(false);
        
        this.handleModalVisibility = this.handleModalVisibility.bind(this);

    }

    handleModalVisibility() {
        this.setState({isVisibleModal: !this.state.isVisibleModal});
    }

    render() {
        return (
            <div className="reportsPage">
                <Pageheader/>
                <div className="container">
                    <div className="reportsPage__header__layout">
                        <h1>{labels.title}</h1>
                        <div className="reportsPage__right-side">
                            <Button
                                value = {labels.buttonValue}
                                onClick={this.handleModalVisibility}
                            />
                            <CSVGenerator 
                                open={this.state.isVisibleModal}
                                selectedRows = {this.props.selectedRows}
                            />
                          
                        </div>
                    </div>
                    <ReportsFilter/>
                    <br/>
                    <ReportsList
                        border={true}
                        bodyRows={this.props.filteredTrips}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        filteredTrips: state.listItemsFetch.fullyFilteredTrips,
        selectedRows: state.reportsListReducer.selectedRows
    }),
    dispatch =>
        bindActionCreators(
            {
                fetchItems: fetchTrips,
                clearFilters
            },
            dispatch
        )
)(ReportsPage);