import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form } from "react-form";
import { TextInput, Radio, Select, Popup } from "../components";
import { updateUser } from "../actions";
import { register, region, popup, errors, activity } from "../data/text";
import "../styles/forms.css";

const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

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
        const validateEmail = (email) => {
            return !email || !email.trim() ? "Email" + errors[lang].required
                : !regex.test(email) ? errors[lang].email
                    : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            email: validateEmail(values.email),
        };
    }

    submit = (submittedValues) => {
        const { updateUser, user, lang } = this.props;
        submittedValues.access_token = user.access_token;
        submittedValues.kitchenOwner = submittedValues.kitchenOwner === "true";
        const url = `http://0.0.0.0:9000/api/users/${user.id}`;
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(submittedValues),
        };
        fetch(url, query)
            .then(res => {
                switch (res.status) {
                    case 204:
                        return res.json();
                    case 200:
                        return res.json();
                    default:
                        this.setState({ popup: { message: popup[lang].errorMessageConnect } });
                        throw new Error(popup[lang].errorMessageConnect);
                }

            })
            .then(user => {
                user.access_token = this.props.user.access_token;
                updateUser(user);
                this.setState({ redirect: "/dashboard" });
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

    populateOptions = (lang) => {
        const regionOptions = [];

        regionOptions.push({
            label: register[lang].region,
            value: "",
            disabled: true,
        });
        for (const r in region[lang]) {
            if (region[lang].hasOwnProperty(r) && r !== "all") {
                regionOptions.push({
                    label: region[lang][r],
                    value: r,
                });
            }
        }

        return { regionOptions };
    }
    render = () => {
        const { user, lang } = this.props;
        const label = register[lang];
        const { regionOptions } = this.populateOptions(lang);
        const defaultValues = Object.assign({}, user);
        defaultValues.kitchenOwner = String(defaultValues.kitchenOwner);
        return (
            this.state.redirect ?
                <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        defaultValues={defaultValues}
                        validateError={this.errorValidator}
                        onSubmitFailure={this.onSubmitFailure}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container" key={lang}>
                                <div className="inline">
                                    <TextInput id="firstName" placeholder={label.firstName} />
                                    <TextInput id="lastName" placeholder={label.lastName} />
                                </div>
                                <Radio id="kitchenOwner" options={["false", "true"]}
                                    labels={{ false: label.kitchenOwner0, true: label.kitchenOwner1 }} />
                                <Select id="region" options={regionOptions} />
                                <TextInput id="name" placeholder={label.username} icon="fa-user" />
                                <TextInput id="email" placeholder="Email" icon="fa-envelope" readOnly />
                                <TextInput id="phone" placeholder={label.phone} icon="fa-phone-square" />

                                {!user.kitchenOwner
                                    ? <Radio id="activity" options={activity.map} label={label.activity} labels={activity[lang]} />
                                    : null
                                }
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">{label.update}</button>
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledForm);