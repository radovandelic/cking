import React, { Component } from 'react';
import {
    Form,
    StyledText
} from 'react-form';
import "../styles/forms.css";

//var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    errorValidator = (values) => {
        const validateFirstName = (firstName) => {
            return !firstName ? 'First name is required.' : null;
        };
        const validateLastName = (lastName) => {
            return !lastName ? 'Last name is required.' : null;
        };
        const validateEmail = (email) => {
            return !email ? 'Email is required.' : null;
        };
        const validatePassword = (password) => {
            return !password ? 'Password is required.' : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            email: validateEmail(values.email),
            password: validatePassword(values.password)
        };
    }

    warningValidator = (values) => {
        const validateFirstName = (firstName) => {
            return firstName && firstName.length < 2 ? 'First name must be longer than 2 characters.' : null;
        };
        const validateLastName = (lastName) => {
            return lastName && lastName.length < 2 ? 'Last name must be longer than 2 characters.' : null;
        };
        const validateEmail = (email) => {
            return email && !regex.test(email) ? 'Please enter a valid email.' : null;
        };
        const validatePassword = (password) => {
            return password && password.length < 8 ? 'Password must be longer than 8 characters.' : null;
        };

        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            email: validateEmail(values.email),
            password: validatePassword(values.password)
        };
    }

    successValidator = (values, errors) => {
        const validateFirstName = () => {
            return !errors.firstName ? '' : null;
        };
        const validateLastName = () => {
            return !errors.lastName ? '' : null;
        };
        const validateEmail = () => {
            return !errors.email ? '' : null;
        };
        const validatePassword = () => {
            return !errors.password ? '' : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            email: validateEmail(values.email),
            password: validatePassword(values.password)
        };
    }

    submit = (submittedValues) => {
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
            .then(res => res.json())
            .then(data => {
                if (typeof (Storage) !== undefined) {
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
                validateError={this.errorValidator}
                validateWarning={this.warningValidator}
                validateSuccess={this.successValidator}
                onSubmit={this.submit}>
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
                            <button id="submit" type="submit" className="mb-4 btn btn-warning">Submit</button>
                        </div>
                    </form>
                )}
            </Form>

        )
    }
}

export default StyledForm;