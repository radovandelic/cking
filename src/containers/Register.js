import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, StyledText, StyledCheckbox, StyledRadioGroup, StyledRadio } from 'react-form';
import base64 from 'base-64';
import { Popup } from '../components';
import { updateUser } from '../actions';
import "../styles/forms.css";

var regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
var errorTitle = "Error"
var errorMessageConnect = "There has been an error connecting to the server. Please try again later.";
var errorMessageAlreadyRegistered = "This email address is already registered.";

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect
            }
        };
    }

    errorValidator = (values) => {
        const validateFirstName = (firstName) => {
            if (!firstName || !firstName.trim()) return 'First name is required.';
            return firstName.length < 2 ? 'First name must be longer than 2 characters.' : null;
        };
        const validateLastName = (lastName) => {
            if (!lastName || !lastName.trim()) return 'Last name is required.';
            return lastName && lastName.length < 2 ? 'Last name must be longer than 2 characters.' : null;
        };
        const validateUserType = (kitchenOwner) => {
            return !kitchenOwner ? 'User type is required.' : null;
        };
        const validateEmail = (email) => {
            if (!email || !email.trim()) return 'Email is required.';
            return email && !regex.test(email) ? 'Please enter a valid email.' : null;
        };
        const validatePassword = (password) => {
            if (!password || !password.trim()) return 'Password is required.';
            return password && password.length < 8 ? 'Password must be longer than 8 characters.' : null;
        };
        const validateConfirmPassword = (password, confirmPassword) => {
            if (!confirmPassword || !confirmPassword.trim()) return 'Password is required.';
            return password && confirmPassword !== password ? 'Passwords do not match' : null;
        };
        const validateAgree = (agree) => {
            return !agree ? 'Please read and accept the Terms of Service' : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            kitchenOwner: validateUserType(values.kitchenOwner),
            email: validateEmail(values.email),
            password: validatePassword(values.password),
            confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
            agree: validateAgree(values.agree)
        };
    }

    submit = (submittedValues) => {
        const { updateUser, lang } = this.props;
        submittedValues.kitchenOwner = submittedValues.kitchenOwner === "true" ? true : undefined;
        submittedValues.lang = lang
        let url = 'http://0.0.0.0:9000/api/users/register';
        let query = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(submittedValues)
        }
        fetch(url, query)
            .then(res => {
                switch (res.status) {
                    case 409:
                        this.setState({ popup: { message: errorMessageAlreadyRegistered } });
                        throw new Error(errorMessageAlreadyRegistered);
                    case 201:
                        return res.json();
                    default:
                        this.setState({ popup: { message: errorMessageConnect } });
                        throw new Error(errorMessageConnect);
                }

            })
            .then(data => {
                if (submittedValues.rememberMe && typeof (Storage) !== undefined) {
                    window.localStorage.setItem("access_token", data.token);
                    window.localStorage.setItem("user", base64.encode(JSON.stringify(data.user)));
                }
                data.user.access_token = data.token;
                updateUser(data.user);
                this.setState({ redirect: data.kitchenOwner ? '/dashboard' : '/' });
            })
            .catch(err => this.setState({ overlay: "overlay on" }));

    }

    onSubmitFailure = (errors) => {
        for (let e in errors) {
            if (errors[e]) {
                document.getElementById(e).focus();
                window.scrollBy(0, -120);
                break;
            }
        }
    }

    render = () => {
        return (
            this.state.redirect ?
                <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        validateError={this.errorValidator}
                        onSubmitFailure={this.onSubmitFailure}
                        defaultValues={{ rememberMe: true }}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container">
                                <div className="inline">
                                    <div className="form-group has-feedback">
                                        <StyledText className="form-control" placeholder="First name" field="firstName" id="firstName" />
                                    </div>
                                    <div className="form-group has-feedback">
                                        <StyledText className="form-control" placeholder="Last name" field="lastName" id="lastName" />
                                    </div>
                                </div>
                                <div className="form-group" id="kitchenOwner">
                                    <StyledRadioGroup field="kitchenOwner" id="kitchenOwner">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="false" id="false" label="I am registering as a kitchen user" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="true" id="true" label="I am registering as a kitchen owner" className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                <div className="form-group has-feedback" >
                                    <StyledText className="form-control" placeholder="Username" field="name" id="name" />
                                </div>
                                <div className="form-group has-feedback" >
                                    <StyledText className="form-control" placeholder="Email" type="email" field="email" id="email" />
                                    <i className="fa fa-user form-control-feedback"></i>
                                </div>
                                <div className="form-group has-feedback" >
                                    <StyledText className="form-control" placeholder="Password" type="password" field="password" id="password" />
                                    <i className="fa fa-lock form-control-feedback"></i>
                                </div>
                                <div className="form-group has-feedback" >
                                    <StyledText className="form-control" placeholder="Confirm password" type="password" field="confirmPassword" id="confirm-password" />
                                </div>
                                <div className="form-group" id="terms" >
                                    <StyledCheckbox field="agree" id="agree"
                                        label={
                                            <span>I agree with the&nbsp;
                                                <a href="/terms" target="_blank" rel="noopener noreferrer">
                                                    Terms of Service
                                                </a>
                                            </span>} />
                                </div>
                                <div className="inline">
                                    <div className="form-group" >
                                        <StyledCheckbox field="rememberMe" id="rememberme" label="Remember Me " />
                                    </div>
                                    <div className="form-group" >
                                        <button id="submit" type="submit" className="btn btn-orange">Register</button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={errorTitle}
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div>

        )
    }
    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

const mapStateToProps = state => {
    return {
        lang: state.user.lang || navigator.language.substring(0, 2)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => {
            dispatch(updateUser(user));
        }
    }
}

StyledForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledForm)

export default StyledForm;