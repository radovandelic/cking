import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, StyledText, StyledCheckbox } from 'react-form';
import { connect } from 'react-redux';
import base64 from 'base-64';
import { Popup } from '../components';
import { updateKitchen, updateUser } from '../actions';
import "../styles/forms.css";

var errorTitle = "Error"
var errorMessageConnect = "There has been an error connecting to the server. Please try again later."
var errorMessageNotFound = "E-mail or password not found."
var errorMessageUnauthorized = "Unauthorized access."

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

    submit = (submittedValues) => {
        let { updateKitchen, updateUser } = this.props;
        let url = 'http://0.0.0.0:9000/api/auth';
        let username = submittedValues.email;
        let password = submittedValues.password;

        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                role: "user"
            })
        })
            .then(response => {
                switch (response.status) {
                    case 401:
                        this.setState({ popup: { message: errorMessageUnauthorized } });
                        throw new Error(errorMessageNotFound);
                    case 400:
                        this.setState({ popup: { message: errorMessageNotFound } });
                        throw new Error(errorMessageNotFound);
                    case 201:
                        return response.json();
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
                url = `http://0.0.0.0:9000/api/kitchens/user/${data.user.id}/?access_token=${data.token}`;
                return fetch(url, { method: 'GET', headers: headers })
            })
            .then(response => response.json())
            .then(kitchen => {
                if (submittedValues.rememberMe && typeof (Storage) !== undefined) {
                    window.localStorage.setItem("mykitchen", base64.encode(JSON.stringify(kitchen)));
                }
                updateKitchen(kitchen);
                this.setState({ redirect: "/dashboard" });
            })
            .catch(err => {
                if (!this.props.user.id) this.setState({ overlay: "overlay on" })
                else this.setState({ redirect: "/dashboard" })
            });
    }
    render = () => {
        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        onSubmit={this.submit}
                        defaultValues={{ rememberMe: true }}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form2" className="form-container">
                                <div className="input-div" >
                                    <label htmlFor="email">Email</label>
                                    <StyledText type="email" field="email" id="email" />
                                </div>
                                <div className="input-div" >
                                    <label htmlFor="password">Password</label>
                                    <StyledText type="password" field="password" id="password" />
                                </div>
                                <div className="input-div" >
                                    <StyledCheckbox field="rememberMe" id="rememberme" label="Remember Me " />
                                </div>
                                <div className="input-div" >
                                    <button id="submit" type="submit" className="btn btn-orange">Login</button>
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
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateKitchen: (kitchen) => {
            dispatch(updateKitchen(kitchen));
        },
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