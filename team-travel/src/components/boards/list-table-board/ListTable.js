import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/table-board-styles.scss';
import labels from './table-board-labels.json';
import Button from '../../layout/Button/Button';

class ListTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstIndex: 0,
            lastIndex: ListTable.PAGE_SIZE,
            currentPage: 1,
            lastPage: (!!this.props.bodyRows ? 
                        (this.props.bodyRows.length === 0 ? 
                            1 : 
                            Math.ceil(this.props.bodyRows.length / ListTable.PAGE_SIZE)
                        )
                    : 1),
        };
        this.handleSkipToFirst = this.handleSkipToFirst.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleSkipToLast = this.handleSkipToLast.bind(this);
    }

    static PAGE_SIZE = 5;

    resolveErrorMessage(error, isLoading){
        let message;

        if(!!error) {
            message = error;
        } else if (isLoading) {
            message = "Trip information is loading...";
        } else {
            message = "There are no trips scheduled for this day."
        }

        return message;
    }

    renderBody(bodyRows){
        if(!bodyRows || bodyRows.length === 0){
            let message = this.resolveErrorMessage(this.props.error, this.props.isLoading);

            return(
                <tr className="table-board__row">
                    <td className="table-board__item -center" colSpan="7">
                        <span className="generic-text" align="center">{message}</span>
                    </td>
                </tr>
            );
        }

        const todayDate = new Date();
        const body = bodyRows.slice(this.state.firstIndex, this.state.lastIndex).map(
            row => {
                const tripDate = new Date(row.leavingDate);
                return(
                    <tr className="table-board__row" key={row.id}>
                        <td className="table-board__item -center" >
                            <span className="generic-text">{row.driver}</span>
                        </td>
                        <td className="table-board__item -center" >
                            <span className="generic-text">{row.origin}</span>
                        </td>
                        <td className="table-board__item -center" >
                            <span className="generic-text">{row.destination}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">
                                {row.passengers.map(pass => pass.fullName).join(", ")}
                            </span>
                        </td>
                        <td className="table-board__item -center" >
                            <span className="generic-text">{row.time + ' | ' + row.date}</span>
                        </td>
                        <td className="table-board__item -right" >
                            <span className="generic-text">{row.availableSeats}</span>
                        </td>
                        <td className={"table-board__item -center"} >
                        { !row.passengers.find(passenger => passenger.userId === this.props.currentUser.id) &&
                            <span className="generic-text">
                                <Button 
                                    value={labels.buttonText} 
                                    onClick={() => this.props.onClick(row)} 
                                    styleName="btn-bordered -light"
                                    isDisabled={!!(row.availableSeats <= 0) || this.props.currentUser.id === row.driverID || tripDate < todayDate}
                                />
                            </span>
                        } 
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
                        {labels.driver} 
                    </td> 
                    <td className={"table-board__item -center"}> 
                        {labels.origin} 
                    </td>
                    <td className={"table-board__item -center"}> 
                        {labels.destination} 
                    </td> 
                    <td className={"table-board__item"}> 
                        {labels.passengers} 
                    </td> 
                    <td className={"table-board__item -center"}> 
                        {labels.time} 
                    </td> 
                    <td className={"table-board__item -center"}> 
                        {labels.availableSeats} 
                    </td> 
                    <td className={"table-board__item"} /> 
                </tr>
            </thead>
        );
    }

    handleSkipToFirst(){
        this.setState(
            {
                currentPage: 1,
                firstIndex: 0,
                lastIndex: ListTable.PAGE_SIZE
            }
        );
    }

    handlePreviousClick(){
        this.setState(
            {
                currentPage: this.state.currentPage - 1,
                firstIndex: this.state.firstIndex - ListTable.PAGE_SIZE,
                lastIndex: this.state.lastIndex - ListTable.PAGE_SIZE
            }
        );
    }

    handleNextClick(){
        this.setState(
            {
                currentPage: this.state.currentPage + 1,
                firstIndex: this.state.firstIndex + ListTable.PAGE_SIZE,
                lastIndex: this.state.lastIndex + ListTable.PAGE_SIZE
            }
        );
    }

    handleSkipToLast(){
        this.setState(
            {
                currentPage: this.state.lastPage,
                firstIndex: (this.state.lastPage - 1) * ListTable.PAGE_SIZE,
                lastIndex: this.state.lastPage * ListTable.PAGE_SIZE
            }
        );
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.setState({
                firstIndex: 0,
                lastIndex: ListTable.PAGE_SIZE,
                currentPage: 1,
                lastPage: (!!this.props.bodyRows ? 
                    (this.props.bodyRows.length === 0 ? 
                        1 : 
                        Math.ceil(this.props.bodyRows.length / ListTable.PAGE_SIZE)
                    )
                : 1),
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
                            {this.renderBody(this.props.bodyRows)} 
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

ListTable.propTypes = {
    bodyRows: PropTypes.arrayOf(
        PropTypes.shape({
            "id": PropTypes.number,
            "driver": PropTypes.string,
            "origin": PropTypes.string,
            "destination": PropTypes.string,
            "passengers": PropTypes.arrayOf(PropTypes.shape({tripId: PropTypes.number, userId: PropTypes.number, fullName: PropTypes.string})),
            "time": PropTypes.string,
            "availableSeats": PropTypes.number,
        })
    ),
    onClick: PropTypes.func,
    error: PropTypes.string,
    isLoading: PropTypes.bool
}

export default ListTable;