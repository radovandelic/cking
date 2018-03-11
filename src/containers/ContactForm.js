import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, StyledText, TextArea } from 'react-form';
import base64 from 'base-64';
import { Popup } from '../components';
import { updateKitchen, updateUser } from '../actions';
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

    componentDidMount = () => {

        if (localStorage.getItem("mykitchen") && localStorage.getItem("mykitchen").length < 25) {
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('mykitchen');
            localStorage.removeItem('mykitchen_id');
        }

        if (!this.props.user.id) {
            let { updateUser } = this.props;
            let user = localStorage.getItem("user");
            user = user ? JSON.parse(base64.decode(user)) : null;
            if (user) {
                user.access_token = localStorage.getItem("access_token");
                updateUser(user);
            }

        }

        if (!this.props.kitchen.id) {
            let { updateKitchen } = this.props;
            let mykitchen = localStorage.getItem("mykitchen");
            mykitchen = mykitchen ? JSON.parse(base64.decode(mykitchen)) : null;
            if (mykitchen) updateKitchen(mykitchen);
        }
    }

    errorValidator = (values) => {
        const validateEmail = (email) => {
            return !email ? 'email est requis' : null;
        };
        const validateMessage = (message) => {
            return !message ? 'message is required' : null;
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
        let url = '/api/mails/enquiry';
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
        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        defaultValues={{ email: this.props.user.email || "" }}
                        validateError={this.errorValidator}
                        validateWarning={this.warningValidator}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form2">
                                <div className="input-div" >
                                    <label htmlFor="email">Email</label>
                                    <StyledText type="email" field="email" id="email" />
                                </div>
                                <div className="input-div" >
                                    <label htmlFor="message">Message</label>
                                    <TextArea style={{ width: '100%' }} rows="4" field="message" id="message" />
                                </div>
                                <div className="input-div" >
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
        user: state.user,
        kitchen: state.kitchen
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