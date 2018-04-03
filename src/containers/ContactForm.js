import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, StyledText, StyledTextArea } from "react-form";
import { Popup } from "../components";
import { popup, errors } from "../data/text";
import "../styles/forms.css";
import "../styles/contact.css";

const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

class StyledForm extends Component {

    constructor(props) {
        const { lang } = props;
        super(props);
        this.state = {
            redirect: false,
            overlay: "overlay off",
            popup: {
                title: popup[lang].errorTitle,
                message: popup[lang].errorMessageConnect,
            },
        };
    }

    errorValidator = (values) => {
        const { lang } = this.props;
        const validateEmail = (email) => {
            return !email ? "Email" + errors[lang].required
                : !regex.test(email) ? "Email" + errors[lang].invalid
                    : null;
        };
        const validateMessage = (message) => {
            return !message ? popup[lang].message + errors[lang].required
                : message.length < 10 ? popup[lang].message + errors[lang].short
                    : null;
        };
        return {
            email: validateEmail(values.email),
            message: validateMessage(values.message),
        };
    }

    submit = (submittedValues) => {
        const { lang } = this.props;
        const url = "http://0.0.0.0:9000/api/mails/enquiry";
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(submittedValues),
        })
            .then(response => {
                switch (response.status) {
                    case 500:
                        this.setState({ popup: { title: popup[lang].errorTitle, message: popup[lang].errorMessageConnect } });
                        throw new Error(popup["en"].errorMessageConnect);
                    case 200:
                        return response.json();
                    default:
                        this.setState({ popup: { title: popup[lang].errorTitle, message: popup[lang].errorMessageConnect } });
                        throw new Error(popup["en"].errorMessageConnect);
                }
            })
            .then(data => {
                this.setState({
                    overlay: "overlay on",
                    popup: {
                        title: popup[lang].successTitleContact,
                        message: (
                            <p>
                                {popup[lang].successMessageContact1}
                                <br />
                                {popup[lang].successMessageContact2}
                            </p>
                        ),
                    },
                });
            })
            .catch(err => this.setState({ overlay: "overlay on" }));
    }

    render = () => {
        const { email, lang } = this.props;
        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        defaultValues={{ email }}
                        validateError={this.errorValidator}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form">
                                <div className="form-group has-feedback" >
                                    <StyledText placeholder="Email" type="email" field="email" id="eml" />
                                    <i className="fa fa-envelope form-control-feedback"></i>
                                </div>
                                <div className="form-group" >
                                    <StyledTextArea placeholder={popup[lang].message} rows="4" field="message" id="msg" />
                                </div>
                                <div className="form-group" >
                                    <button type="submit" className="btn btn-orange">{popup[lang].submit}</button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={this.state.popup.title}
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div>

        );

    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" }, () => {
            if (this.state.popup.title !== "Error") {
                document.getElementById("msg").value = "";
                document.getElementById("eml").value = "";
                window.location.href = "#top";
            }
        });
    }
}

const mapStateToProps = state => ({
    email: state.user.email || "",
    lang: state.user.lang,
});

export default connect(
    mapStateToProps,
    null
)(StyledForm);