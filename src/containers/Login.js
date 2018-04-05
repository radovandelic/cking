import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, StyledCheckbox } from "react-form";
import { connect } from "react-redux";
import base64 from "base-64";
import { TextInput, Popup } from "../components";
import { updateKitchen, updateUser } from "../actions";
import { register, popup } from "../data/text";
import "../styles/forms.css";

class StyledForm extends Component {

    constructor(props) {
        const { lang } = props;
        super(props);
        this.state = {
            redirect: false,
            overlay: "overlay off",
            popup: {
                message: popup[lang].errorMessageConnect,
            },
        };
    }

    submit = (submittedValues) => {
        const { updateUser, updateKitchen, lang } = this.props;
        let url = "http://0.0.0.0:9000/api/auth";
        const username = submittedValues.email;
        const password = submittedValues.password;

        const headers = new Headers();
        headers.append("Authorization", "Basic " + base64.encode(username + ":" + password));
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                role: "user",
            }),
        })
            .then(response => {
                switch (response.status) {
                    case 401:
                        this.setState({ popup: { message: popup[lang].errorMessageUnauthorized } });
                        throw new Error(popup["en"].errorMessageNotFound);
                    case 400:
                        this.setState({ popup: { message: popup[lang].errorMessageNotFound } });
                        throw new Error(popup["en"].errorMessageNotFound);
                    case 201:
                        return response.json();
                    default:
                        this.setState({ popup: { message: popup[lang].errorMessageConnect } });
                        throw new Error(popup["en"].errorMessageConnect);
                }
            })
            .then(data => {
                data.user.access_token = data.token;
                updateUser(data.user);
                if (submittedValues.rememberMe && typeof (Storage) !== undefined) {
                    window.localStorage.setItem("access_token", data.token);
                    window.localStorage.setItem("user", base64.encode(JSON.stringify(data.user)));
                }
                url = `http://0.0.0.0:9000/api/kitchens/user/${data.user.id}/?access_token=${data.token}`;
                return fetch(url, { method: "GET", headers: headers });
            })
            .then(response => response.json())
            .then(kitchen => {
                updateKitchen(kitchen);
                this.setState({ redirect: "/dashboard" });
            })
            .catch(err => {
                if (!this.props.user.id) this.setState({ overlay: "overlay on" });
                else this.setState({ redirect: "/dashboard" });
            });
    }
    render = () => {
        const { lang } = this.props;
        const label = register[lang];
        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        onSubmit={this.submit}
                        defaultValues={{ rememberMe: true }}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container login-container" key={lang}>
                                <TextInput id="email" placeholder={"Email"} type="email" icon="fa-envelope" />
                                <TextInput id="password" placeholder={label.password} type="password" icon="fa-lock" />
                                <div className="inline">
                                    <div className="form-group" >
                                        <StyledCheckbox field="rememberMe" id="rememberme" label={label.rememberMe} />
                                    </div>
                                    <div className="form-group" >
                                        <button id="submit" type="submit" className="btn btn-orange">{label.login}</button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={popup[lang].errorTitle}
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div>

        );
    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

const mapStateToProps = state => ({
    user: state.user,
    lang: state.user.lang,
});

const mapDispatchToProps = dispatch => ({
    updateUser: (user) => dispatch(updateUser(user)),
    updateKitchen: (kitchen) => dispatch(updateKitchen(kitchen)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledForm);