import React, { Component } from 'react';
import {
    Form,
    StyledText
} from 'react-form';
import "../styles/forms.css";

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    submit = (submittedValues) => {
        let base64 = require('base-64');

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
                access_token: "D1D7djby3fa9MaEBNt3o802cNx887ywy"
            })
            //credentials: 'user:passwd'
        })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
    }
    render = () => {
        return (
            <Form
                onSubmit={this.submit}>
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
                            <button id="submit" type="submit" className="mb-4 btn btn-warning">Login</button>
                        </div>
                    </form>
                )}
            </Form>

        )
    }
}

export default StyledForm;