import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, StyledText, StyledTextArea } from 'react-form';
import { Popup } from '../components';
import "../styles/forms.css";
import "../styles/contact.css";

var regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
var errorMessageConnect = "There has been an error connecting to the server. Please try again later."
var successTitle = "Message sent"
var successMessage =
    <p>
        Your message has been sent to the cookwork support team.
      <br />
        You will receive a response soon.
    </p>

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            overlay: "overlay off",
            popup: {
                title: "Error",
                message: errorMessageConnect
            }
        };
    }


    errorValidator = (values) => {
        const validateEmail = (email) => {
            return !email ? 'email est requis' : null;
        };
        const validateMessage = (message) => {
            return !message ? 'message est requis' : null;
        };
        return {
            email: validateEmail(values.email),
            message: validateMessage(values.message)
        };
    }

    warningValidator = (values) => {
        const validateEmail = (email) => {
            return email && !regex.test(email) ? 'email invalide' : null;
        };
        const validateMessage = (message) => {
            return message && message.length < 10 ? 'Message is too short.' : null;
        };

        return {
            email: validateEmail(values.email),
            message: validateMessage(values.message)
        };
    }
    submit = (submittedValues) => {
        let url = 'http://0.0.0.0:9000/api/mails/enquiry';
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(submittedValues)
        })
            .then(response => {
                switch (response.status) {
                    case 500:
                        this.setState({ popup: { title: "Error", message: errorMessageConnect } });
                        throw new Error(errorMessageConnect);
                    case 200:
                        return response.json();
                    default:
                        this.setState({ popup: { title: "Error", message: errorMessageConnect } });
                        throw new Error(errorMessageConnect);
                }
            })
            .then(data => {
                this.setState({
                    overlay: "overlay on",
                    popup: { title: successTitle, message: successMessage }
                })
            })
            .catch(err => this.setState({ overlay: "overlay on" }));
    }

    render = () => {
        let { email } = this.props.user;
        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        defaultValues={{ email: email || "" }}
                        validateError={this.errorValidator}
                        validateWarning={this.warningValidator}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form2">
                                <div className="form-group has-feedback" >
                                    <StyledText placeholder="Email" type="email" field="email" id="email" />
                                    <i className="fa fa-user form-control-feedback"></i>
                                </div>
                                <div className="form-group has-feedback" >
                                    <StyledTextArea placeholder="Message" style={{ width: '100%' }} rows="4" field="message" id="message" />
                                </div>
                                <div className="form-group has-feedback" >
                                    <button id="submit" type="submit" className="btn btn-orange">Envoyer</button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={this.state.popup.title}
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div>

        )

    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" }, () => {
            if (this.state.popup.title !== "Error") {
                document.getElementById("message").value = "";
                document.getElementById("email").value = "";
                window.location.href = "#top";
            }
        });
    }
}


const mapStateToProps = state => {
    return {
        user: state.user
    }
}

StyledForm = connect(
    mapStateToProps,
    null
)(StyledForm)

export default StyledForm;