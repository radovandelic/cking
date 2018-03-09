import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, StyledText, TextArea } from 'react-form';
import "../styles/forms.css";
import { Popup } from '../components';

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

    submit = (submittedValues) => {
        let url = 'http://0.0.0.0:8080/api/mails/enquiry';

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
                        onSubmit={this.submit}
                        defaultValues={{ rememberMe: true }}>
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
                document.getElementById("email").value = "";
                document.getElementById("message").value = "";
                window.location.href = "#top";
            }
        }
        );
    }
}

export default StyledForm;