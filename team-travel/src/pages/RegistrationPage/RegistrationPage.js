import React, { Component } from 'react';
import Button from '../../components/layout/Button/Button';
import Input from '../../components/layout/input/Input';
import './RegistrationStyle.scss';
import { AttemptRegistration } from '../../actions/registrationActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RegistrationRequirements } from '../../constants/DataRequirements'
import labels from './registration-page-labels.json';

const loginPath = '/login';

class RegistrationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pass: "",
            repeatPass: "",
            name: "",
            surname: "",
            slackId: "",
            phone: "",
            carPlate: "",
            errors: {
                email: true,
                passwords: true,
                fullName: true,
                slackId: true,
                phone: true,
                carPlate: true
            },
            errorMessage: "",
            showError: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonGoBack = this.buttonGoBack.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.findError = this.findError.bind(this);
        this.registrationSuccessful = this.registrationSuccessful.bind(this);
        this.registrationUnsuccessful = this.registrationUnsuccessful.bind(this);
    }

    buttonGoBack() {
        this.props.history.push(loginPath);
    }

    isFormValid() {
        return !((this.state.repeatPass === this.state.pass)
            && (this.state.name.trim() !== "")
            && (this.state.email.trim() !== "")
            && (this.state.surname.trim() !== ""));
    }

    findError() {
        if (!this.state.email || this.state.email.trim() === '' || !RegExp(RegistrationRequirements.emailPattern).test(this.state.email.trim()))
            this.setState({
                errors: { ...this.state.errors, email: false }
            });
        else if (!this.state.pass || this.state.pass.trim() === '' || this.state.pass.length < RegistrationRequirements.passwordMinLength ||
            !RegExp(RegistrationRequirements.passwordPattern).test(this.state.pass.trim())) {
            this.setState({
                errors: { ...this.state.errors, passwords: false }
            });
        }
        else if (!this.state.name || this.state.name.trim() === '' || this.state.name.length > RegistrationRequirements.nameMaxLength ||
            !this.state.surname || this.state.surname.trim() === '' || this.state.surname.length > RegistrationRequirements.nameMaxLength) {
            this.setState({
                errors: { ...this.state.errors, fullName: false }
            });
        }
        else if(!!this.state.phone && !RegExp(RegistrationRequirements.phonePattern).test(this.state.phone.trim())) {
            this.setState({
                errors: { ...this.state.errors, phone: false }
            });
        }
        else if(!!this.state.carPlate && !RegExp(RegistrationRequirements.carPlatePattern).test(this.state.carPlate.trim())) {
            this.setState({
                errors: { ...this.state.errors, carPlate: false }
            });
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
            errors: {
                email: true,
                passwords: true,
                fullName: true
            },
            errorMessage: '',
            showError: false
        });
    }

    registrationSuccessful() {
        this.buttonGoBack();
    }

    registrationUnsuccessful() {
        let errorField;

        if (!!this.props.errorFetch.field) {
            switch (this.props.errorFetch.field.toLowerCase()) {
                case 'email':
                    errorField = 'email';
                    break;
                case 'password':
                    errorField = 'passwords';
                    break;
                case 'fullname':
                    errorField = 'fullName';
                    break;
                default:
                    break;
            }
            this.setState({
                errors: {
                    ...this.state.errors,
                    [errorField]: false
                },
                errorMessage: this.props.errorFetch.message,
                showError: true
            });
        }
        else
            this.setState({
                errorMessage: this.props.errorFetch.message,
                showError: true
            });
    }

    handleSubmit(e) {
        this.props.AttemptRegistration({
            fullName: this.state.name.trim() + ' ' + this.state.surname.trim(),
            email: this.state.email.trim(),
            password: this.state.pass.trim(),
            slackId: !!this.state.slackId.trim() ? this.state.slackId.trim() : null,
            carPlate: !!this.state.carPlate.trim() ? this.state.carPlate.trim() : null,
            phone: !!this.state.phone.trim() ? this.state.phone.trim() : null,

            registrationSuccessful: this.registrationSuccessful,
            registrationUnsuccessful: this.registrationUnsuccessful,
        });
        e.preventDefault();
    }

    render() {
        const errorMessage = (
            <div>
                <div className="errorMessage">
                    {labels.failMessage + this.state.errorMessage}
                </div>
            </div>
        );
        return (
            <div className="container">
                <div className="centerObject">
                    <div className="floatLeft">
                        <div className="icon devbridge-logo" />
                        <h1 className="title"> {labels.carpoolingTitle} </h1>
                        <h5 className="title"> {labels.registrationTitle} </h5>
                    </div>
                    <div className="board-container registration-page">
                        <div className="table-board_content ">
                           {this.state.showError ? errorMessage : null}
                            <div className="requiredFieldsDesc">* required fields</div>

                            <form onSubmit={this.handleSubmit} onInvalid={this.findError} >

                                    <Input
                                        input={{
                                            name: "email",
                                            id: "email_id",
                                            placeholder: labels.emailPlaceholder,
                                            value: this.state.email,
                                            onChange: this.handleChange,
                                            type: "email"
                                        }}
                                        title={labels.emailTitle}
                                        errorList={{ error: this.state.errors.email }}
                                        isRequired={true}
                                    />
                                    <Input
                                        input={{
                                            name: "pass",
                                            id: "password_id",
                                            placeholder: labels.passwordPlaceholder,
                                            minLength: RegistrationRequirements.passwordMinLength,
                                            value: this.state.pass,
                                            onChange: this.handleChange,
                                            type: "password",
                                            pattern: RegistrationRequirements.passwordPattern,
                                            title: labels.passwordHelperTitle
                                        }}
                                        title={labels.passwordTitle}
                                        errorList={{ error: this.state.errors.passwords }}
                                        isRequired={true}
                                    />
                                    <Input
                                        input={{
                                            name: "repeatPass",
                                            id: "repeatPassword_id",
                                            placeholder: labels.passwordPlaceholder,
                                            value: this.state.repeatPass,
                                            onChange: this.handleChange,
                                            type: "password"
                                        }}
                                        title={labels.repeatPasswordTitle}
                                        errorList={{ error: this.state.errors.passwords }}
                                        isRequired={true}
                                    />
                                    <Input
                                        input={{
                                            name: "name",
                                            id: "name_id",
                                            placeholder: labels.namePlaceholder,
                                            value: this.state.name,
                                            onChange: this.handleChange,
                                            type: "text",
                                            maxLength: RegistrationRequirements.nameMaxLength
                                        }}
                                        title={labels.nameTitle}
                                        errorList={{ error: this.state.errors.fullName }}
                                        isRequired={true}
                                    />
                                    <Input
                                        input={{
                                            name: "surname",
                                            id: "surname_id",
                                            placeholder: labels.surnamePlaceholder,
                                            value: this.state.surname,
                                            onChange: this.handleChange,
                                            type: "text",
                                            maxLength: RegistrationRequirements.nameMaxLength
                                        }}
                                        title={labels.surnameTitle}
                                        errorList={{ error: this.state.errors.fullName }}
                                        isRequired={true}
                                    />
                                    <Input
                                        input={{
                                            name: "slackId",
                                            id: "slackId_id",
                                            placeholder: labels.slackPlaceholder,
                                            value: this.state.slackId,
                                            onChange: this.handleChange,
                                            type: "text",
                                        }}
                                        title={labels.slackTitle}
                                        errorList={{ error: this.state.errors.slackId }}
                                    />
                                     <Input
                                        input={{
                                            name: "carPlate",
                                            id: "carPlate_id",
                                            placeholder: labels.carPlatePlaceholder,
                                            value: this.state.carPlate,
                                            onChange: this.handleChange,
                                            pattern: RegistrationRequirements.carPlatePattern,
                                            type: "text",
                                        }}
                                        title={labels.carPlateTitle}
                                        errorList={{ error: this.state.errors.carPlate }}
                                    />
                                     <Input
                                        input={{
                                            name: "phone",
                                            id: "phone_id",
                                            placeholder: labels.phonePlaceholder,
                                            value: this.state.phone,
                                            onChange: this.handleChange,
                                            pattern: RegistrationRequirements.phonePattern,
                                            type: "text",
                                        }}
                                        title={labels.phoneTitle}
                                        errorList={{ error: this.state.errors.phone }}
                                    />
                                    <div className="registration-buttons">
                                        <Button
                                            styleName={"btn-bordered -light"}
                                            value={labels.backButtonValue}
                                            type={"button"}
                                            onClick={this.buttonGoBack}
                                        />
                                        <Button
                                            styleName={"btn-bordered"}
                                            value={labels.submitButtonValue}
                                            type={"submit"}
                                            isDisabled={this.isFormValid()}
                                        />
                                    
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        errorFetch: state.registrationReducer.errorFetch
    }),
    dispatch =>
        bindActionCreators(
            {
                AttemptRegistration
            },
            dispatch
        )
)(RegistrationPage);