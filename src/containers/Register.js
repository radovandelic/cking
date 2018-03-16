import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, StyledText } from 'react-form';
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
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            email: validateEmail(values.email),
            password: validatePassword(values.password),
            confirmPassword: validateConfirmPassword(values.password, values.confirmPassword)
        };
    }

    submit = (submittedValues) => {
        const { updateUser } = this.props;
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
                if (typeof (Storage) !== undefined) {
                    window.localStorage.setItem("access_token", data.token);
                    window.localStorage.setItem("user", base64.encode(JSON.stringify(data.user)));
                }
                data.user.access_token = data.token;
                updateUser(data.user);
                this.setState({ redirect: '/dashboard' });
            })
            .catch(err => this.setState({ overlay: "overlay on" }));

    }
    render = () => {
        return (
            this.state.redirect ?
                <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        validateError={this.errorValidator}
                        onSubmit={this.submit} onSubmitFailure={e => { console.log(e) }}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form2" className="form-container">
                                <div className="inline">
                                    <div className="input-div">
                                        <label htmlFor="firstName">First name</label>
                                        <StyledText field="firstName" id="firstName" />
                                    </div>
                                    <div className="input-div">
                                        <label htmlFor="lastName">Last name</label>
                                        <StyledText field="lastName" id="lastName" />
                                    </div>
                                </div>
                                <div className="input-div" >
                                    <label htmlFor="username">Username</label>
                                    <StyledText field="name" id="name" />
                                </div>
                                <div className="input-div" >
                                    <label htmlFor="email">Email</label>
                                    <StyledText type="email" field="email" id="email" />
                                </div>
                                <div className="input-div" >
                                    <label htmlFor="password">Password</label>
                                    <StyledText type="password" field="password" id="password" />
                                </div>
                                <div className="input-div" >
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <StyledText type="password" field="confirmPassword" id="confirm-password" />
                                </div>
                                <div className="input-div" >
                                    <button id="submit" type="submit" className="btn btn-orange">Register</button>
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

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => {
            dispatch(updateUser(user));
        }
    }
}

StyledForm = connect(
    null,
    mapDispatchToProps
)(StyledForm)

export default StyledForm;