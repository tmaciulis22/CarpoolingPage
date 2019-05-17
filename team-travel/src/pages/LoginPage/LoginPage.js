import React, { Component } from 'react';
import Button from '../../components/layout/Button/Button';
import Input from '../../components/layout/input/Input';
import './loginStyle.scss';
import { AttemptLogin } from '../../actions/loginActions'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

class LoginForm extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            buttonDisabled: true,
            errorMessage: "",
            showError: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.registerClicked = this.registerClicked.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.loginSuccessful = this.loginSuccessful.bind(this);
        this.loginUnsuccessful = this.loginUnsuccessful.bind(this);
    }

    registerClicked() {
        this.props.history.push('/Registration')
        this.clearInput();
    }

    handleNameChange = (event) => {
        this.setState({
            email: event.target.value,
            showError: false,
            buttonDisabled: ((event.target.value.trim() === "") || (this.state.password.trim() === ""))
        });
    };

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value,
            showError: false,
            buttonDisabled: ((event.target.value.trim() === "") || (this.state.email.trim() === ""))
        });
    };

    clearInput() {
        this.setState({
            email: '',
            password: ''
        });
    }

    loginSuccessful()
    {
        this.props.history.push('/carpooling');
    }

    loginUnsuccessful()
    {
        this.setState({
            errorMessage: this.props.error,
            showError: true,
        });
    }
    
    handleSubmit(e) {
        this.props.AttemptLogin({
            email:this.state.email,
            password:this.state.password,
            loginSuccessful: this.loginSuccessful,
            loginUnsuccessful: this.loginUnsuccessful,
        });
        e.preventDefault();
    }

    render() {
        const errorList = { email_password : !this.state.showError};
        const errorMessage =(
            <div>
                <div className="errorMessage">
                    {this.state.errorMessage}
                </div>
            </div>
        )
        
        return (
        <div className="container">
            <div className="centerObject">
                    <div className="floatLeft">
                        <div className="icon devbridge-logo" />
                        <h1 className="title">
                            Carpooling
                        </h1>
                    </div>
                    <div className="board-container login-page">
                            <br />
                            {this.state.showError ? errorMessage : null}
                            <form onSubmit={this.handleSubmit}>
                                <Input
                                    input={{
                                        name: "email",
                                        id: "email_id",
                                        placeholder: "user@email.com",
                                        minLength: "5",
                                        value: this.state.email,
                                        onChange: this.handleNameChange,
                                        type: "email",
                                    }}
                                    title={"Email"}
                                    errorList={errorList}
                                    isRequired={true}
                                />
                                <Input
                                    input={{
                                        name: "password",
                                        id: "password_id",
                                        placeholder: "********",
                                        value: this.state.pass,
                                        onChange: this.handlePasswordChange,
                                        type: "password"
                                    }}
                                    title={"Password"}
                                    errorList={errorList}
                                    isRequired={true}

                                />
                                <div className="floatRight">
                                    <div className="floatRight">
                                    <Button
                                        styleName={"btn-bordered"}
                                        value={"Login"}
                                        setType={"submit"}
                                        isDisabled={this.state.buttonDisabled}
                                    />
                                    </div>
                                      <Button
                                            styleName={"btn-bordered -light"}
                                            value={"Register"}
                                            setType={"button"}
                                            onClick={() => this.registerClicked()}
                                        />
                                </div>
                            </form>
                    
                        <br />                
                </div>
            </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        error: state.loginReducer.error
    }),
    dispatch =>
        bindActionCreators(
            {
                AttemptLogin: AttemptLogin
            },
            dispatch
        )
)(LoginForm);