import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/table-board-styles.scss';
import labels from './table-board-labels.json';
import Button from '../../layout/Button/Button';
import * as action from '../../../actions/reportsListActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ReportsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstIndex: 0,
            lastIndex: ReportsList.PAGE_SIZE,
            currentPage: 1,
            lastPage: (!!this.props.bodyRows ? 
                        (this.props.bodyRows.length === 0 ? 
                            1 : 
                            Math.ceil(this.props.bodyRows.length / ReportsList.PAGE_SIZE)
                        )
                    : 1),
            bodyRows: (!!this.props.bodyRows ? this.props.bodyRows : []),
            selectedAmount: 0,
            totalAmount: !!this.props.bodyRows ? this.props.bodyRows.length : 0,
        };
        this.selectAll = this.selectAll.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleSkipToFirst = this.handleSkipToFirst.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleSkipToLast = this.handleSkipToLast.bind(this);
    }

    static PAGE_SIZE = 10;

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
    renderBody(){

        if(this.state.bodyRows.length === 0){
            let message = this.resolveErrorMessage(this.props.error, this.props.isLoading);

            return(
                <tr className="table-board__row">
                    <td className="table-board__item -center" colSpan="8">
                        <span className="generic-text" align="center">{message}</span>
                    </td>
                </tr>
            );
        }

        const body = this.state.bodyRows.slice(this.state.firstIndex, this.state.lastIndex).map(
            row => {
                return(
                    <tr className="table-board__row" key={row.id}>
                        <td className={"table-board__item -center"}>
                            <label className="checkbox">
                                <input 
                                    className={"checkbox__input"} 
                                    type="checkbox" 
                                    onChange={() => this.handleSelection(row)}
                                    checked={this.props.selectedRows.includes(row)}
                                />
                                <span className="checkbox__checkmark icon checkmark-white"/>
                            </label>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">{row.driver}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">{row.origin}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">{row.destination}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">
                                {row.passengers.map(pass => pass.fullName).join(", ")}
                            </span>
                        </td>
                        <td className="table-board__item -right" >
                            <span className="generic-text">{row.time + ' | ' + row.date}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">{row.status}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">{row.carType}</span>
                        </td> 
                    </tr>
                );
            }
        );

        return body;
    }

    renderHead(){
        return(
            <thead className="table-board__table-head">
                <tr className="table-board__row">
                    <td className={"table-board__item -center"}>
                        <label className="checkbox">
                            <input 
                                className={"checkbox__input"} 
                                type="checkbox" 
                                onChange={this.selectAll}
                                checked={this.state.totalAmount !== 0 ? this.state.selectedAmount === this.state.totalAmount : false}
                            />
                            <span className="checkbox__checkmark icon checkmark-white"/>
                        </label>
                    </td>
                    <td className={"table-board__item"}> 
                        {labels.driver} 
                    </td> 
                    <td className={"table-board__item"}> 
                        {labels.origin} 
                    </td>
                    <td className={"table-board__item"}> 
                        {labels.destination} 
                    </td> 
                    <td className={"table-board__item"}> 
                        {labels.passengers} 
                    </td> 
                    <td className={"table-board__item"}> 
                        {labels.date} 
                    </td> 
                    <td className={"table-board__item"}> 
                        {labels.status} 
                    </td> 
                    <td className={"table-board__item"}>
                        {labels.carType}
                    </td> 
                </tr>
            </thead>
        );
    }

    selectAll(){
        let selected;
        let amount;

        if(this.state.selectedAmount === this.state.totalAmount){
            selected = [];
            amount = 0;
        } else {
            selected = this.state.bodyRows;
            amount = this.state.totalAmount;
        }

        this.props.updateRowSelection(selected);

        this.setState(
            {
                selectedAmount: amount,
            }
        )
    }

    handleSelection(row){
        let selected = Array.from(this.props.selectedRows);
        let amount = this.state.selectedAmount;

        if(selected.includes(row)) {
            let index = selected.indexOf(row);

            selected.splice(index, 1);
            amount--;
        }else {
            selected.push(row);
            amount++;
        }

        this.props.updateRowSelection(selected);

        this.setState(
            {
                selectedAmount: amount,
            }
        )
    }

    handleSkipToFirst(){
        this.setState(
            {
                currentPage: 1,
                firstIndex: 0,
                lastIndex: ReportsList.PAGE_SIZE
            }
        );
    }

    handlePreviousClick(){
        this.setState(
            {
                currentPage: this.state.currentPage - 1,
                firstIndex: this.state.firstIndex - ReportsList.PAGE_SIZE,
                lastIndex: this.state.lastIndex - ReportsList.PAGE_SIZE
            }
        );
    }

    handleNextClick(){
        this.setState(
            {
                currentPage: this.state.currentPage + 1,
                firstIndex: this.state.firstIndex + ReportsList.PAGE_SIZE,
                lastIndex: this.state.lastIndex + ReportsList.PAGE_SIZE
            }
        );
    }

    handleSkipToLast(){
        this.setState(
            {
                currentPage: this.state.lastPage,
                firstIndex: (this.state.lastPage - 1) * ReportsList.PAGE_SIZE,
                lastIndex: this.state.lastPage * ReportsList.PAGE_SIZE
            }
        );
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.setState({
                firstIndex: 0,
                lastIndex: ReportsList.PAGE_SIZE,
                currentPage: 1,
                bodyRows: (!!this.props.bodyRows ? this.props.bodyRows : []),
                lastPage: (!!this.props.bodyRows ? 
                    (this.props.bodyRows.length === 0 ? 
                        1 : 
                        Math.ceil(this.props.bodyRows.length / ReportsList.PAGE_SIZE)
                    )
                : 1),
                selectedAmount: this.props.selectedRows.length,
                totalAmount: !!this.props.bodyRows ? this.props.bodyRows.length : 0
            })
        }
    }

    render(){
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
                    <div className="table-board--footer-left">
                        <span className="generic-text">Selected: {this.state.selectedAmount} of {this.state.totalAmount}</span>
                    </div>
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

ReportsList.propTypes = {
    bodyRows: PropTypes.arrayOf(
        PropTypes.shape({
            "id": PropTypes.number,
            "driver": PropTypes.string,
            "origin": PropTypes.string,
            "destination": PropTypes.string,
            "passengers": PropTypes.arrayOf(PropTypes.shape({tripId: PropTypes.number, userId: PropTypes.number, fullName: PropTypes.string})),
            "date": PropTypes.date,
            "time": PropTypes.string,
            "status": PropTypes.string,
            "carType": PropTypes.string
        })
    ),
    error: PropTypes.string,
    isLoading: PropTypes.bool
}

export default connect(
    state => ({
        selectedRows: state.reportsListReducer.selectedRows
    }),
    dispatch =>
        bindActionCreators(
            {
                updateRowSelection: action.updateRowSelection
            },
            dispatch
        )
)(ReportsList);
