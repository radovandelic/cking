import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, StyledCheckbox } from "react-form";
import base64 from "base-64";
import { TextInput, Radio, Popup } from "../components";
import { updateUser } from "../actions";
import { register, popup, errors } from "../data/text";
import "../styles/forms.css";

const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            overlay: "overlay off",
            popup: {
                message: "",
            },
        };
    }

    errorValidator = (values) => {
        const { lang } = this.props;
        const validateFirstName = (firstName) => {
            return !firstName || !firstName.trim() ? register[lang].firstName + errors[lang].required
                : firstName.length < 2 ? register[lang].firstName + errors[lang].short
                    : null;
        };
        const validateLastName = (lastName) => {
            return !lastName || !lastName.trim() ? register[lang].lastName + errors[lang].required
                : lastName.length < 2 ? register[lang].lastName + errors[lang].short
                    : null;
        };
        const validatePhone = (phone) => {
            return !phone || !phone.trim() ? register[lang].phone + errors[lang].required : null;
        };
        const validateUserType = (kitchenOwner) => {
            return !kitchenOwner ? register[lang].type + errors[lang].required : null;
        };
        const validateEmail = (email) => {
            return !email || !email.trim() ? "Email" + errors[lang].required
                : !regex.test(email) ? errors[lang].email
                    : null;
        };
        const validatePassword = (password) => {
            return !password || !password.trim() ? register[lang].password + errors[lang].required
                : password.length < 8 ? register[lang].password + errors[lang].length0 + 8 + errors[lang].length1
                    : null;
        };
        const validateConfirmPassword = (password, confirmPassword) => {
            return !confirmPassword || !confirmPassword.trim() ? register[lang].password + errors[lang].required
                : confirmPassword !== password ? errors[lang].confirmPassword
                    : null;
        };
        const validateAgree = (agree) => {
            return !agree ? errors[lang].agree : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            phone: validatePhone(values.phone),
            kitchenOwner: validateUserType(values.kitchenOwner),
            email: validateEmail(values.email),
            password: validatePassword(values.password),
            confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
            agree: validateAgree(values.agree),
        };
    }

    submit = (submittedValues) => {
        const { updateUser, lang } = this.props;
        submittedValues.kitchenOwner = submittedValues.kitchenOwner === "true" ? true : undefined;
        submittedValues.lang = lang;
        const url = "http://0.0.0.0:9000/api/users/register";
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(submittedValues),
        };
        fetch(url, query)
            .then(res => {
                switch (res.status) {
                    case 409:
                        this.setState({ popup: { message: popup[lang].errorMessageAlreadyRegistered } });
                        throw new Error(popup[lang].errorMessageAlreadyRegistered);
                    case 201:
                        return res.json();
                    default:
                        this.setState({ popup: { message: popup[lang].errorMessageConnect } });
                        throw new Error(popup[lang].errorMessageConnect);
                }

            })
            .then(data => {
                if (submittedValues.rememberMe && typeof (Storage) !== undefined) {
                    window.localStorage.setItem("access_token", data.token);
                    window.localStorage.setItem("user", base64.encode(JSON.stringify(data.user)));
                }
                data.user.access_token = data.token;
                updateUser(data.user);
                this.setState({ redirect: data.kitchenOwner ? "/dashboard" : "/" });
            })
            .catch(err => this.setState({ overlay: "overlay on" }));

    }

    onSubmitFailure = (errors) => {
        for (const e in errors) {
            if (errors[e]) {
                document.getElementById(e).focus();
                window.scrollBy(0, -120);
                break;
            }
        }
    }

    render = () => {
        const { lang } = this.props;
        const label = register[lang];
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
                            <form onSubmit={formApi.submitForm} id="form" className="form-container" key={lang}>
                                <h3>{label.title}</h3>
                                <div className="inline">
                                    <TextInput id="firstName" placeholder={label.firstName} />
                                    <TextInput id="lastName" placeholder={label.lastName} />
                                </div>
                                <TextInput id="phone" placeholder={label.phone} icon="fa-phone-square" />
                                <TextInput id="name" placeholder={label.username} icon="fa-user" />
                                <TextInput id="email" placeholder={"Email"} type="email" icon="fa-envelope" />
                                <TextInput id="password" placeholder={label.password} type="password" icon="fa-lock" />
                                <TextInput id="confirmPassword" placeholder={label.confirmPassword} type="password" icon="fa-lock" />

                                <Radio id="kitchenOwner" options={["false", "true"]}
                                    labels={{
                                        false: label.registeringAs0 + label.kitchenOwner0,
                                        true: label.registeringAs1 + label.kitchenOwner1,
                                    }} />

                                <div className="form-group" id="terms" >
                                    <StyledCheckbox field="agree" id="agree"
                                        label={
                                            <span>{label.agree0}
                                                <a href="/terms" target="_blank" rel="noopener noreferrer">
                                                    {label.agree1}
                                                </a>
                                            </span>} />
                                </div>

                                <div className="inline">
                                    <div className="form-group" >
                                        <StyledCheckbox field="rememberMe" id="rememberme" label="Remember Me " />
                                    </div>
                                    <div className="form-group" >
                                        <button id="submit" type="submit" className="btn btn-orange">{label.register}</button>
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
    lang: state.user.lang,
});

const mapDispatchToProps = dispatch => ({
    updateUser: (user) => dispatch(updateUser(user)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledForm);