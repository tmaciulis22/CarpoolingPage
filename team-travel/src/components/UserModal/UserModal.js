import React, { Component } from 'react';
import ModalBoard from "../boards/modal-board/ModalBoard";
import Dropdown from "../layout/dropdown/Dropdown";
import Input from "../layout/input/Input.js"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/adminPanelActions';
import CityOptions from '../../constants/CityOptions.js';
import UserRoles from '../../constants/UserRoles';
import { AdminPanelRequirements } from '../../constants/DataRequirements';

class UserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: props.row,
            enteredPlate: "",
            isVisibleModal: false,
            errors: {
                fullName: true,
                phoneNumber: true,
                email: true,
                slackId: true,
                carPlates: true,
            },
        };

        this.handleClose = this.handleClose.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.handleUser = this.handleUser.bind(this);
        this.handleFullNameChange = this.handleFullNameChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSlackIdChange = this.handleSlackIdChange.bind(this);
        this.handleMainOfficeChange = this.handleMainOfficeChange.bind(this);
        this.handleUserRoleChange = this.handleUserRoleChange.bind(this);
        this.handleCarPlatesChange = this.handleCarPlatesChange.bind(this);
        this.findError = this.findError.bind(this);
        this.generateCarPlatesList = this.generateCarPlatesList.bind(this);
        this.addOrRemovePlate = this.addOrRemovePlate.bind(this);
        this.isPlateOwned = this.isPlateOwned.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
    }
    isPlateOwned() {
        return !!this.state.row.carPlates && this.state.row.carPlates.includes(this.state.enteredPlate);
    }
    generateCarPlatesList(plates) {
        if (!!plates) return (
            <div >
                <datalist id="carPlates" >
                    {plates.map((plate, index) =>
                        <option key={index} value={plate} />
                    )}
                </datalist>
            </div>
        );
    };
    addOrRemovePlate() {
        if (!!this.state.enteredPlate) {
            if (RegExp(AdminPanelRequirements.carPlatePattern).test(this.state.enteredPlate.trim())) {
                this.isPlateOwned() ?
                    this.setState({
                        row: {
                            ...this.state.row,
                            carPlates: this.state.row.carPlates.filter(plate => plate !== this.state.enteredPlate.trim()),
                        },
                        enteredPlate: '',
                        errors: { ...this.state.errors, carPlates: true }
                    }) :
                    this.state.row.carPlates.push(this.state.enteredPlate.trim());
                this.setState({
                    enteredPlate: '',
                    errors: { ...this.state.errors, carPlates: true }
                });
            }
            else {
                this.setState({
                    showError: true,
                    errorMessage: "Error",
                    errors: { ...this.state.errors, carPlates: false }
                });
            }
        }
    }
    handleEnterKey(e) {
        if (e.key === 'Enter') {
            this.addOrRemovePlate();
            e.preventDefault();
        }
    }

    deleteUser = () => {
        this.props.handleDeleteUser({
            id: this.state.row.id
        });
        this.setState({
            isVisibleModal: false,
        });
    }

    componentDidUpdate(previousProps) {
        if (previousProps.open !== this.props.open) {
            this.setState({
                isVisibleModal: true,
                row: this.props.row,
            });
        }
    }

    handleClose() {
        this.setState({
            isVisibleModal: !this.state.isVisibleModal,
            row: {},
            enteredPlate: "",
            errors: {
                fullName: true,
                phoneNumber: true,
                email: true,
                slackId: true,
                carPlates: true,
            }
        });
    }

    handleUser = () => {
        if (!Object.values(this.state.errors).includes(false)) {
        this.props.handleUser({
            userDataAdmin: {
                id: this.state.row.id,
                fullName: this.state.row.fullName,
                phoneNumber: this.state.row.phoneNumber,
                email: this.state.row.email,
                slackId: this.state.row.slackId,
                mainOffice: this.state.row.mainOffice === CityOptions[1] ? CityOptions[1] : CityOptions[2],
                roleId: this.state.row.roleId ,
                carPlates: this.state.row.carPlates,
            }
        });
        this.setState({
            isVisibleModal: false,
        });
    }
    };

    handleFullNameChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                fullName: e.target.value
            }
        });
    }

    handlePhoneNumberChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                phoneNumber: e.target.value
            }
        });
    }
    handleEmailChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                email: e.target.value
            }
        });
    }

    handleSlackIdChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                slackId: e.target.value
            }
        });
    }

    handleMainOfficeChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                mainOffice: e.target.value
            }
        });
    }

    handleUserRoleChange(e) {
        this.setState({
            row: {
                ...this.state.row,
                roleId: e.target.value=== UserRoles[1] ? 1 : e.target.value === UserRoles[2] ? 2 : 3,
            }
        });
    }

    handleCarPlatesChange(e) {
        this.setState({
            enteredPlate: e.target.value,
            errors: {
                ...this.state.errors,
                carPlates: true
            },
            showError: false
        });

    }
    findError() {
        this.setState({
            errors: {
                ...this.state.errors,
                fullName: !(!this.state.row.fullName || this.state.row.fullName.trim() === ''),
                phoneNumber: !(!!this.state.row.phoneNumber ? !RegExp(AdminPanelRequirements.phonePattern).test(this.state.row.phoneNumber.trim()) : false),
                email: !(!this.state.row.email || this.state.row.email.trim() === '' || !RegExp(AdminPanelRequirements.emailPattern).test(this.state.row.email.trim())),
            }
        },
            () => {
                    this.handleUser();  
            });
    }
    

    render() {

        const modal = (
            <div>
                <form id="UserFormId">
                    <div className="row">
                        <div className="col-s-12">
                            <Input
                                title={"Full name"}
                                input={{
                                    type: "text",
                                    name: "fullName",
                                    placeholder: "Full Name",
                                    onChange: this.handleFullNameChange,
                                    value: !!this.state.row.fullName ? this.state.row.fullName : '',
                                    required: true
                                }}
                                errorList={{ error: this.state.errors.fullName }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-s-6">
                            <Input
                                title={"Phone number"}
                                input={{
                                    type: "text",
                                    name: "phoneNumber",
                                    placeholder: "Phone number...",
                                    onChange: this.handlePhoneNumberChange,
                                    value: !!this.state.row.phoneNumber ? this.state.row.phoneNumber : ''
                                }}
                                errorList={{ error: this.state.errors.phoneNumber }}
                            />
                        </div>
                        <div className="col-s-6">
                            <Input
                                title={"Email"}
                                input={{
                                    type: "text",
                                    name: "email",
                                    placeholder: "Email",
                                    onChange: this.handleEmailChange,
                                    value: !!this.state.row.email ? this.state.row.email : '',
                                    required: true,
                                }}
                                errorList={{ error: this.state.errors.email }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-s-6">
                            <Input
                                title={'Slack Id'}
                                input={{
                                    type: "text",
                                    name: "slackId",
                                    placeholder: "Slack id",
                                    onChange: this.handleSlackIdChange,
                                    value: !!this.state.row.slackId ? this.state.row.slackId : ''
                                }}
                                errorList={{ error: this.state.errors.slackId }}
                            />
                        </div>
                        <div className="col-s-6">
                            <Dropdown
                                title="Main office"
                                options={Object.values(CityOptions)}
                                onChange={this.handleMainOfficeChange}
                                name="mainOffice"
                                value={this.state.row.mainOffice === CityOptions[1] ? CityOptions[1] : CityOptions[2]}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-s-6">
                            <Dropdown
                                title="User role"
                                options={Object.values(UserRoles)}
                                onChange={this.handleUserRoleChange}
                                name="userRole"
                                value={this.state.row.roleId === 1 ? UserRoles[1] : this.state.row.roleId === 2 ? UserRoles[2] : UserRoles[3]}
                            />
                        </div>
                        <div className="col-s-6">
                            <Input
                                input={{
                                    name: "enteredPlate",
                                    value: this.state.enteredPlate,
                                    placeholder: "AAA000",
                                    onChange: this.handleCarPlatesChange,
                                    onKeyDown: this.handleEnterKey,
                                    list: 'carPlates',
                                    autoComplete: "off",                                    
                                }}
                                icon={this.isPlateOwned() ? "icon cross" : "icon plus"}
                                onClickIcon={this.addOrRemovePlate}
                                title={"Car plate"}
                                errorList={{ error: this.state.errors.carPlates }}
                            />
                        </div>
                        {this.generateCarPlatesList(this.state.row.carPlates)}
                    </div>
                </form>
            </div>
        );
        return (
            <ModalBoard
                isVisible={this.state.isVisibleModal}
                headerTitle={"User info"}
                headerButton={{
                    value: "Delete user",
                    onClick: this.deleteUser
                }}
                innerSection={modal}
                footerButtonValue={"Save"}
                footerButtonOnClick={this.findError}
                form={"UserFormId"}
                cancelOnClick={this.handleClose}
            />
        );

    }
}

export default connect(
    state => ({
        userDataAdmin: state.userSettings.userDataAdmin,
    }),
    dispatch =>
        bindActionCreators(
            {
                handleUser: actions.updateUserData,
                handleDeleteUser: actions.deleteUser,
            },
            dispatch
        )
)(UserModal);


