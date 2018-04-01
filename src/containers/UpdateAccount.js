import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, StyledText, StyledSelect, StyledRadioGroup, StyledRadio } from "react-form";
import { Popup } from "../components";
import { updateUser } from "../actions";
import { register, regions, popup } from "../data/translations";
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
        const validateFirstName = (firstName) => {
            if (!firstName || !firstName.trim()) return "First name is required.";
            return firstName.length < 2 ? "First name must be longer than 2 characters." : null;
        };
        const validateLastName = (lastName) => {
            if (!lastName || !lastName.trim()) return "Last name is required.";
            return lastName && lastName.length < 2 ? "Last name must be longer than 2 characters." : null;
        };
        const validateEmail = (email) => {
            if (!email || !email.trim()) return "Email is required.";
            return email && !regex.test(email) ? "Please enter a valid email." : null;
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
        for (const region in regions[lang]) {
            if (regions[lang].hasOwnProperty(region) && region !== "all") {
                regionOptions.push({
                    label: regions[lang][region],
                    value: region,
                });
            }
        }

        return { regionOptions };
    }
    render = () => {
        const { user, lang } = this.props;
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
                            <form onSubmit={formApi.submitForm} id="form" className="form-container">
                                <div className="inline">
                                    <div className="form-group">
                                        <label htmlFor="firstName">{register[lang].firstName}</label>
                                        <StyledText className="form-control" field="firstName" id="firstName" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">{register[lang].lastName}</label>
                                        <StyledText className="form-control" field="lastName" id="lastName" />
                                    </div>
                                </div>
                                <div className="form-group radio-group" >
                                    <StyledRadioGroup field="kitchenOwner" id="kitchenOwner" key={lang}>
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="false" id="false" label={register[lang].kitchenOwner0} className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="true" id="true" label={register[lang].kitchenOwner1} className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                <div className="form-group" >
                                    <StyledSelect type="text" field="region" id="region"
                                        options={regionOptions} />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="username">{register[lang].username}</label>
                                    <StyledText className="form-control" field="name" id="name" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="email">Email</label>
                                    <StyledText readOnly type="email" className="form-control" field="email" id="email" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="phone">{register[lang].phone}</label>
                                    <StyledText type="phone" className="form-control" field="phone" id="phone" />
                                </div>
                                {!user.kitchenOwner ?
                                    <div className="form-group radio-group">
                                        <StyledRadioGroup field="activity" id="activity">
                                            {group => (
                                                <ul className="radio-grid" >
                                                    <label htmlFor="activity">Votre activité:</label>
                                                    <li> <StyledRadio group={group} value="restoraunt" id="restoraunt" label="Restaurateur" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="entrepreneur" id="entrepreneur" label="Entrepreneur dans l'alimentation" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="chef" id="chef" label="Chef itinérant" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="organiser" id="organiser" label="Je veux organiser des ateliers" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="caterer" id="caterer" label="Traiteur sans atelier" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="professional" id="professional" label="Professionnel ayant besoin de plus d'espace" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="kitchenworker" id="kitchenworker" label="Je travaille en cuisine (Chef, CDP, commis, plongeur, autre)" className="d-inline-block" /> </li>
                                                </ul>
                                            )}
                                        </StyledRadioGroup>
                                    </div>
                                    : null
                                }
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">{register[lang].update}</button>
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