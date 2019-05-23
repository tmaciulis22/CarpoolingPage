import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/about-me-styles.scss';
import Input from '../../layout/input/Input';
import Dropdown from '../../layout/dropdown/Dropdown';
import Button from '../../layout/Button/Button.js';
import CityOptions from '../../../constants/CityOptions';
import labels from './about-me-labels.json';
import { UserSettingsRequirements } from '../../../constants/DataRequirements';
import Avatar from 'react-avatar';

class AboutMe extends Component {
    constructor(props) {
        super(props);
        this.state={
            id: props.id,
            fullName: props.fullName,
            phoneNumber: props.phoneNumber,
            slackId: props.slackId,
            mainOffice: props.mainOffice,
            isDriver: props.isDriver,
            carPlates: props.carPlates,
            enteredPlate: '',
            oldPassword: '',
            newPassword: '',
            stateChanged: false,
            errors: {
                fullName: true,
                phoneNumber: true,
                slackId: true,
                carPlates: true,
                oldPassword: true,
                newPassword: true
            },
            errorMessage: "",
            showError: false
        };
        this.onInput = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.findError = this.findError.bind(this);
        this.updateUnsuccessful = this.updateUnsuccessful.bind(this);
        this.updateSuccessful = this.updateSuccessful.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.generateCarPlatesList = this.generateCarPlatesList.bind(this);
        this.addOrRemovePlate = this.addOrRemovePlate.bind(this);
        this.isPlateOwned = this.isPlateOwned.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.generateErrorMessage = this.generateErrorMessage.bind(this);
    }

    isPlateOwned() {
        return !!this.state.carPlates && this.state.carPlates.includes(this.state.enteredPlate);
    }

    onInput(e) {
        const {name, value} = e.target;
        switch(name){
            case "isDriver":
                this.setState({
                    [name]: !this.state.isDriver,
                    stateChanged: true,
                    showError: false
                });
                break;
            case "enteredPlate":
                this.setState({
                    [name]: value,
                    stateChanged: true,
                    errors: {
                        ...this.state.errors,
                        carPlates: true
                    },
                    showError: false
                });
                break;
            default:
                this.setState({
                    [name]: value,
                    stateChanged: true,
                    errors: {
                        ...this.state.errors,
                        [name]: true
                    },
                    showError: false
                });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                id: this.props.id,
                fullName: this.props.fullName,
                phoneNumber: this.props.phoneNumber,
                slackId: this.props.slackId,
                mainOffice: this.props.mainOffice,
                isDriver: this.props.isDriver,
                carPlates: this.props.carPlates,
                errorMessage: !!this.props.error.message ? this.props.error.message : "",
                showError: !!this.props.error.message,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            });
        }
    }

    findError() {
        if(!this.state.fullName || this.state.fullName.trim() === '')
            this.setState({
                errors: { ...this.state.errors, fullName: false }
            });
        else if(!!this.state.phoneNumber && !RegExp(UserSettingsRequirements.phonePattern).test(this.state.phoneNumber.trim())) {
            this.setState({
                errors: { ...this.state.errors, phoneNumber: false }
            });
        }
        else if(!!this.state.carPlates && !this.state.carPlates.every(plate => RegExp(UserSettingsRequirements.carPlatePattern).test(plate))) {
            this.setState({
                errors: { ...this.state.errors, carPlates: false }
            });
        }
        else if((!!this.state.newPassword && (!this.state.oldPassword || this.state.oldPassword.trim() === '')) ||
            (!!this.state.oldPassword && !RegExp(UserSettingsRequirements.passwordPattern).test(this.state.oldPassword.trim()))) {
            this.setState({
                errors: { ...this.state.errors, oldPassword: false }
            });
        }
        else if(!!this.state.oldPassword && (!this.state.newPassword || this.state.newPassword.trim() === '' ||
            !RegExp(UserSettingsRequirements.passwordPattern).test(this.state.newPassword.trim()))) {
            this.setState({
                errors: { ...this.state.errors, newPassword: false }
            });
        }
    }

    onSubmit(e) {
        this.setState({
            stateChanged: false
        }, () => this.props.onSave({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            slackId: this.state.slackId,
            mainOffice: this.state.mainOffice,
            isDriver: this.state.isDriver,
            carPlates: this.state.carPlates,
            oldPassword: !!this.state.oldPassword ? this.state.oldPassword : null,
            newPassword: !!this.state.newPassword ? this.state.newPassword : null,
            updateSuccessful: this.updateSuccessful,
            updateUnsuccessful: this.updateUnsuccessful
        }));
        e.preventDefault();
    }

    updateUnsuccessful() {
        let errorField;
        if (!!this.props.error.field) {
            switch (this.props.error.field.toLowerCase()) {
                case 'fullname':
                    errorField = 'fullName';
                    break;
                case 'phonenumber':
                    errorField = 'phoneNumber';
                    break;
                case 'carplates':
                    errorField = 'carPlates';
                    break;
                case 'oldpassword':
                    errorField = 'oldPassword';
                    break;
                case 'newPassword':
                    errorField = 'newPassword';
                    break;
                default:
                    break;
            }
            this.setState({
                errors: {
                    ...this.state.errors,
                    [errorField]: false
                },
                errorMessage: this.props.error.message,
                showError: true
            });
        }
        else
            this.setState({
                errorMessage: this.props.error.message,
                showError: true
            });
    }

    updateSuccessful(){
        this.setState({
            oldPassword: "",
            newPassword: ""
        });
        window.location.reload();
    }

    generateCarPlatesList(plates){
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
            if (RegExp(UserSettingsRequirements.carPlatePattern).test(this.state.enteredPlate.trim())) {
                this.isPlateOwned() ? 
                this.setState({
                    carPlates: this.state.carPlates.filter(plate => plate !== this.state.enteredPlate.trim()),
                    enteredPlate: '',
                    errors: {...this.state.errors, carPlates: true}
                }) :
                this.state.carPlates.push(this.state.enteredPlate.trim());
                this.setState({
                    enteredPlate: '',
                    errors: {...this.state.errors, carPlates: true}
                });
            }
            else {
                this.setState({
                    showError: true,
                    errorMessage: labels.platesError,
                    errors: {...this.state.errors, carPlates: false}
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

    generateErrorMessage(){
        return(
            <div className="about-me__errorMessage">
                {typeof(this.state.errorMessage) === "string" ? 
                    this.state.errorMessage : 
                    Object.values(this.state.errorMessage)[2].statusText + `: please refresh page or relogin`
                }
            </div>
        );
    }

    render() {
        return (
            <div className="about-me">
                <div className="board-container">
                    <form onSubmit={this.onSubmit} onInvalid={this.findError}>
                        <div className="board-header">
                            <span className="board-header__title">{labels.boardHeader}</span>
                            {this.state.showError ? this.generateErrorMessage() : null}
                            <Button
                                styleName={"btn-bordered -light"}
                                value={labels.buttonValue}
                                isDisabled={!this.state.stateChanged}
                                type={"submit"}
                            />
                        </div>
                        <div className="about-me__content">
                            <div className="row" >
                                <div className="col-s-12 col-m-6 col-l-4" >
                                    <Input
                                        input={{
                                            name: "fullName",
                                            defaultValue: this.props.fullName,
                                            placeholder: labels.namePlaceholder,
                                            required: true,
                                            onInput: this.onInput,
                                            maxLength: UserSettingsRequirements.nameMaxLength
                                        }}
                                        title={labels.nameTitle}
                                        errorList={{ error: this.state.errors.fullName }}
                                    />
                                </div>
                                <div className="col-s-12 col-m-6 col-l-4">
                                    <Input
                                        input={{
                                            name: "phoneNumber",
                                            defaultValue: this.props.phoneNumber,
                                            placeholder: labels.phonePlaceholder,
                                            type: "tel",
                                            maxLength: 50,
                                            pattern: UserSettingsRequirements.phonePattern,
                                            title: labels.phoneHelperTitle,
                                            onInput: this.onInput
                                        }}
                                        title={labels.phoneTitle}
                                        errorList={{ error: this.state.errors.phoneNumber }}
                                    />
                                </div>
                                <div className="col-s-12 col-m-6 col-l-4">
                                    <Input
                                        input={{
                                            name: "slackId",
                                            defaultValue: this.props.slackId,
                                            placeholder: labels.slackPlaceholder,
                                            onInput: this.onInput
                                        }}
                                        title={labels.slackTitle}
                                        errorList={{ error: this.state.errors.slackId }}
                                    />
                                </div>
                                <div className="col-s-12 col-m-6 col-l-4">
                                    <Dropdown
                                        name={"mainOffice"}
                                        title={labels.officeTitle}
                                        options={Object.values(CityOptions)}
                                        value={this.state.mainOffice}
                                        onChange={this.onInput}
                                    />
                                </div>
                                <div className="col-s-12 col-m-6 col-l-4">
                                    <Dropdown
                                        name={"isDriver"}
                                        title={labels.driverTitle}
                                        options={labels.driverOptions}
                                        value={this.state.isDriver ? labels.driverOptions[0] : labels.driverOptions[1]}
                                        onChange={this.onInput}
                                    />
                                </div>
                                <div className="col-s-12 col-m-6 col-l-4">
                                    <Input
                                        input={{
                                            name: "enteredPlate",
                                            value: this.state.enteredPlate,
                                            placeholder: labels.platesPlaceholder,
                                            onChange: this.onInput,
                                            onKeyDown: this.handleEnterKey,
                                            list: 'carPlates',
                                            autoComplete: "off",
                                            title: labels.platesHelperTitle
                                        }}
                                        icon={this.isPlateOwned() ? "icon cross" : "icon plus"}
                                        onClickIcon={this.addOrRemovePlate}
                                        title={labels.platesTitle}
                                        errorList={{ error: this.state.errors.carPlates }}
                                    />
                                </div>
                                {this.generateCarPlatesList(this.state.carPlates)}
                            </div>
                            <h3> {labels.changePasswordHeader} </h3>
                            <div className="row" >
                                <div className="col-s-12 col-m-6 col-l-4">
                                    <Input
                                        input={{
                                            name: "oldPassword",
                                            placeholder: labels.passwordPlaceholder,
                                            type: "password",
                                            required: !!this.state.newPassword,
                                            minLength: UserSettingsRequirements.passwordMinLength,
                                            pattern: UserSettingsRequirements.passwordPattern,
                                            title: labels.oldPasswordHelperTitle,
                                            onInput: this.onInput
                                        }}
                                        title={labels.oldPasswordTitle}
                                        errorList={{ error: this.state.errors.oldPassword }}
                                    />
                                </div>
                                <div className="col-s-12 col-m-6 col-l-4">
                                    <Input
                                        input={{
                                            name: "newPassword",
                                            placeholder: labels.passwordPlaceholder,
                                            type: "password",
                                            required: !!this.state.oldPassword,
                                            minLength: UserSettingsRequirements.passwordMinLength,
                                            pattern: UserSettingsRequirements.passwordPattern,
                                            title: labels.newPasswordHelperTitle,
                                            onInput: this.onInput
                                        }}
                                        title={labels.newPasswordTitle}
                                        errorList={{ error: this.state.errors.newPassword }}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

AboutMe.propTypes = {
    id: PropTypes.number,
    fullName: PropTypes.string,
    phoneNumber: PropTypes.string,
    slackId: PropTypes.string,
    mainOffice: PropTypes.oneOf(Object.values(CityOptions)),
    isDriver: PropTypes.bool,
    carPlates: PropTypes.arrayOf(PropTypes.string),
    onSave: PropTypes.func,
}

export default AboutMe;