import React, { Component } from 'react';
import {
    Form,
    StyledText, StyledCheckbox
} from 'react-form';
import "../styles/forms.css";
import base64 from 'base-64';

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    submit = (submittedValues) => {
        let url = '/api/auth';
        let username = submittedValues.email;
        let password = submittedValues.password;

        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        fetch(url, {
            method: 'POST',
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                if (submittedValues.rememberMe && typeof (Storage) !== undefined) {
                    window.localStorage.setItem("access_token", data.token);
                    window.localStorage.setItem("user", JSON.stringify(data.user));
                }
                window.location.href = "/dashboard";
            })
            .catch(err => console.log(err));
    }
    render = () => {
        return (
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
                            <button id="submit" type="submit" className="mb-4 btn btn-warning">Login</button>
                        </div>
                    </form>
                )}
            </Form>

        )
    }
}

export default StyledForm;