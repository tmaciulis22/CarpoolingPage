import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/table-board-styles.scss';
import labels from './users-table-board-labels.json';
import Button from '../../layout/Button/Button';
import Input from '../../layout/input/Input';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFilters } from '../../../actions/tripsListActions';
import UserRoles from '../../../constants/UserRoles.js';

class UserListTableFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstIndex: 0,
            lastIndex: UserListTableFilter.PAGE_SIZE,
            currentPage: 1,
            lastPage: (!!this.props.bodyRows ?
                this.props.bodyRows.length === 0 ? 1
                    :
                    Math.ceil(
                        this.props.bodyRows.length / UserListTableFilter.PAGE_SIZE
                    )
                : 1),
            bodyRows: (!!this.props.bodyRows ? this.props.bodyRows : []),
            fullName: "",
            phoneNumber: "",
            email: "",
            slackId: "",
            mainOffice: "",
            roleId: "",
            carPlates: "",
        };

        this.filterRows = this.filterRows.bind(this);
        this.handleFullNameChange = this.handleFullNameChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);       
        this.handleCarPlatesChange = this.handleCarPlatesChange.bind(this);

        this.handleSkipToFirst = this.handleSkipToFirst.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleSkipToLast = this.handleSkipToLast.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.renderHead = this.renderHead.bind(this);
        this.generateNameList = this.generateNameList.bind(this);
    }

    static PAGE_SIZE = 15;
    static filters = ["fullName", "phoneNumber", "carPlates"];

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                firstIndex: 0,
                lastIndex: UserListTableFilter.PAGE_SIZE,
                currentPage: 1,
                lastPage: (!!this.props.bodyRows ?
                    this.props.bodyRows.length === 0 ? 1
                        :
                        Math.ceil(
                            this.props.bodyRows.length / UserListTableFilter.PAGE_SIZE
                        )
                    : 1),
                bodyRows: (!!this.props.bodyRows ? this.props.bodyRows : []),
            })
        }
    }

    filterRows(filterType, newValue) {
        let filteredRows = !!this.props.bodyRows ?
            this.props.bodyRows
            : [];

        UserListTableFilter.filters.forEach(
            filterBy => {
                let filterValue = (filterBy === filterType ? newValue : this.state[filterBy]);

                if (filterValue) {
                    switch(filterBy){
                        case "fullName":
                            filteredRows = filteredRows.filter(row =>
                                row[filterBy].toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
                            );
                            break;
                        case "phoneNumber":
                            filteredRows = filteredRows.filter(row =>                                                               
                               !!row[filterBy] && row[filterBy].includes(filterValue)
                            );
                            break;
                        case "carPlates":
                            filteredRows = filteredRows.filter(row =>
                                row[filterBy].join(', ').toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
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
        this.setState(
            {
                firstIndex: 0,
                lastIndex: UserListTableFilter.PAGE_SIZE,
                currentPage: 1,
                [filterType]: newValue,
                lastPage: (filteredRows.length === 0 ?
                    1 :
                    Math.ceil(filteredRows.length / UserListTableFilter.PAGE_SIZE)
                ),
                bodyRows: filteredRows,
            }
        );  
    }

    handleFullNameChange(e) {
        this.filterRows("fullName", e.target.value);
    }

    handlePhoneNumberChange(e) {
        this.filterRows("phoneNumber", e.target.value);
    }
   
    handleCarPlatesChange(e) {
        this.filterRows("carPlates", e.target.value);
    }

    handleSkipToFirst() {
        this.setState(
            {
                currentPage: 1,
                firstIndex: 0,
                lastIndex: UserListTableFilter.PAGE_SIZE
            }
        );
    }

    handlePreviousClick() {
        this.setState(
            {
                currentPage: this.state.currentPage - 1,
                firstIndex: this.state.firstIndex - UserListTableFilter.PAGE_SIZE,
                lastIndex: this.state.lastIndex - UserListTableFilter.PAGE_SIZE
            }
        );
    }

    handleNextClick() {
        this.setState(
            {
                currentPage: this.state.currentPage + 1,
                firstIndex: this.state.firstIndex + UserListTableFilter.PAGE_SIZE,
                lastIndex: this.state.lastIndex + UserListTableFilter.PAGE_SIZE
            }
        );
    }

    handleSkipToLast() {
        this.setState(
            {
                currentPage: this.state.lastPage,
                firstIndex: (this.state.lastPage - 1) * UserListTableFilter.PAGE_SIZE,
                lastIndex: this.state.lastPage * UserListTableFilter.PAGE_SIZE
            }
        );
    }

    resolveErrorMessage(error, isLoading) {
        let message;

        if (!!error) {
            message = error;
        } else if (isLoading) {
            message = "Users information is loading...";
        } else {
            message = "There are no users to display."
        }

        return message;
    }
    generateNameList() {
        let uniqueNames = [];

        for(let row of this.state.bodyRows){
            uniqueNames.push(row.fullName);
           
        }
        uniqueNames = Array.from(new Set(uniqueNames));

         return (
            <div >
                <datalist id="nameList" >
                    {uniqueNames.map((name, index) =>
                        <option key={index} value={name} />
                    )}
                </datalist>
            </div>
        );
    };

    generatePhoneList() {
        let uniquePhones = [];

        for(let row of this.state.bodyRows){
            uniquePhones.push(row.phoneNumber);
           
        }
        uniquePhones = Array.from(new Set(uniquePhones));

         return (
            <div >
                <datalist id="phoneList" >
                    {uniquePhones.map((phone, index) =>
                        <option key={index} value={phone} />
                    )}
                </datalist>
            </div>
        );
    };
    generateCarPlateList(){
        let uniqueCarPlates = [];

        for(let row of this.state.bodyRows){
            for(let carPlate of row.carPlates){
                uniqueCarPlates.push(carPlate);
            }
        }
        uniqueCarPlates = Array.from(new Set(uniqueCarPlates));

        return (
            <datalist id={"carPlateList"}>
                {uniqueCarPlates.map((carPlate, index) =>
                    <option key={index} value={carPlate} />
                )}
            </datalist>
        );
    }

    renderHead() {
        let alwaysTrueErrorList = {
            noError: true
        }
        return (
            <thead className="table-board__table-head">
                <tr className="table-board__row">
                    <td className="table-board__item">
                        <Input
                            input={{
                                name: "fullName",
                                type: "search",
                                placeholder: labels.inputPlaceholder,
                                onChange: this.handleFullNameChange,
                                list: 'nameList',
                                autoComplete: "off",
                                
                            }}
                            title={labels.fullNameTitle}
                            icon={labels.searchIcon}
                            errorList={alwaysTrueErrorList}
                        />
                     {this.generateNameList()}
                    </td>
                   
                    <td className="table-board__item">
                        <Input
                            input={{
                                name: "phoneNumber",
                                type: "search",
                                placeholder: labels.inputPlaceholder,
                                onChange: this.handlePhoneNumberChange,
                                list: 'phoneList',
                                autoComplete: "off",
                            }}
                            title={labels.phoneNumberTitle}
                            icon={labels.searchIcon}
                            errorList={alwaysTrueErrorList}
                        />
                        {this.generatePhoneList()}
                    </td>
                    
                    <td className="table-board__item">
                    <label>{labels.emailTitle}</label>
                       
                    </td>
                    <td className="table-board__item">
                    <label>{labels.slackTitle}</label>
                        
                    </td>
                    <td className="table-board__item">
                    <label>{labels.mainOfficeTitle}</label>
                       
                    </td>
                    <td className="table-board__item">
                    <label>{labels.userRoleTitle}</label>
                       
                    </td>
                    <td className="table-board__item">
                        <Input
                            input={{
                                type: "search",
                                name: "carPlates",
                                placeholder: labels.inputPlaceholder,
                                onChange: this.handleCarPlatesChange,
                                list: 'carPlateList',
                                autoComplete: "off",
                            }}
                            title={labels.carPlateTitle}
                            icon={labels.searchIcon}
                            errorList={alwaysTrueErrorList}
                        />
                        {this.generateCarPlateList()}
                    </td>
                    <td className={"table-board__item"} />               
                </tr>
            </thead>
        );
    }

    renderBody() {
        if (this.state.bodyRows.length === 0) {
            let message = this.resolveErrorMessage(this.props.error, this.props.isLoading);

            return (
                <tr className="table-board__row">
                    <td className="table-board__item -center" colSpan="6">
                        <span className="generic-text" align="center">{message}</span>
                    </td>
                </tr>
            );
        }

        let body = this.state.bodyRows.slice(this.state.firstIndex, this.state.lastIndex).map(
            row => {
                return (
                    <tr className="table-board__row" key={row.id}>
                        <td className="table-board__item" >
                            <span className="generic-text">{row.fullName}</span>
                        </td>

                        <td className="table-board__item" >
                            <span className="generic-text">{row.phoneNumber}</span>
                        </td>
                        <td className="table-board__item" >
                            <span className="generic-text">{row.email}</span>
                        </td>
                        <td className="table-board__item">
                            <span className="generic-text">{row.slackId}</span>
                        </td>
                        <td className="table-board__item">
                            <span className="generic-text">{row.mainOffice}</span>
                        </td>
                        <td className="table-board__item">
                            <span className="generic-text">{row.roleId === 1 ? UserRoles[1] : row.roleId === 2 ? UserRoles[2] : UserRoles[3]}</span>
                        </td>
                        <td className="table-board__item">
                            <span className="generic-text">
                            {row.carPlates.join(", ")}                        
                            </span>                            
                        </td>
                        <td className={"table-board__item -center"} >
                            <span className="generic-text">
                                <Button
                                    value={labels.buttonText}
                                    onClick={() => this.props.onClick(row)}
                                    styleName="btn-bordered -light"
                                />
                            </span>
                        </td>
                    </tr>
                );
            }
        );

        return body;
    }

    render() {
        return (
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

UserListTableFilter.propTypes = {
    bodyRows: PropTypes.arrayOf(
        PropTypes.shape({
            "id": PropTypes.number,
            "fullName": PropTypes.string,
            "phoneNumber": PropTypes.string,
            "email": PropTypes.string,
            "slackId": PropTypes.string,
            "mainOffice": PropTypes.string,
            "roleId": PropTypes.number,
           "carPlates": PropTypes.arrayOf(PropTypes.string),
        })
    ),   
    onClick: PropTypes.func,
    isLoading: PropTypes.bool,
    error: PropTypes.string
}

export default connect(
    state => ({
        fetchDataInProgress: state.adminPanelUsers.fetchDataInProgress,
    }),
    dispatch =>
        bindActionCreators(
            {
                clearFilters
            },
            dispatch
        )
)(UserListTableFilter);