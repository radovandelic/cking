import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, StyledText, StyledTextArea, StyledRadioGroup, StyledRadio, StyledSelect } from 'react-form';
import { Popup } from '../components';
import { updateUser } from '../actions';
import "../styles/forms.css";

var errorTitle = "Error"
var errorMessageConnect = "There has been an error connecting to the server. Please try again later.";
const regionOptions = [
    {
        label: "Votre ville / region",
        value: "",
        disabled: true
    },
    {
        label: "Antwerpen",
        value: "Antwerpen"
    },
    {
        label: "Brabant",
        value: "Brabant"
    },
    {
        label: "Bruxelles",
        value: "Bruxelles"
    },
    {
        label: "East Flanders",
        value: "EastFlanders"
    },
    {
        label: "Hainaut",
        value: "Hainaut"
    },
    {
        label: "Liege",
        value: "Liege"
    },
    {
        label: "Limburg",
        value: "Limburg"
    },
    {
        label: "Luxembourg",
        value: "Luxembourg"
    },
    {
        label: "Namur",
        value: "Namur"
    },
    {
        label: "West Flanders",
        value: "WestFlanders"
    }
]

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect
            }
        };
    }

    errorValidator = (values) => {
        const validateActivityType = (activityType) => {
            return !activityType ? 'Activity type is required.' : null;
        };
        return {
            activityType: validateActivityType(values.activityType),
        };
    }

    submit = (submittedValues) => {
        /*const { updateUser, lang } = this.props;
        submittedValues.kitchenOwner = submittedValues.kitchenOwner === "true" ? true : undefined;
        submittedValues.lang = lang
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
            .then(res => {
                switch (res.status) {
                    case 409:
                        this.setState({ popup: { message: errorMessageAlreadyRegistered } });
                        throw new Error(errorMessageAlreadyRegistered);
                    case 201:
                        return res.json();
                    default:
                        this.setState({ popup: { message: errorMessageConnect } });
                        throw new Error(errorMessageConnect);
                }

            })
            .then(data => {
                if (submittedValues.rememberMe && typeof (Storage) !== undefined) {
                    window.localStorage.setItem("access_token", data.token);
                    window.localStorage.setItem("user", base64.encode(JSON.stringify(data.user)));
                }
                data.user.access_token = data.token;
                updateUser(data.user);
                this.setState({ redirect: data.kitchenOwner ? '/dashboard' : '/' });
            })
            .catch(err => this.setState({ overlay: "overlay on" }));*/

    }

    onSubmitFailure = (errors) => {
        for (let e in errors) {
            if (errors[e]) {
                document.getElementById(e).focus();
                window.scrollBy(0, -120);
                break;
            }
        }
    }

    render = () => {
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
                            <form onSubmit={formApi.submitForm} id="form" className="form-container">
                                <h3><b>Trouvez la cuisine qu'il vous faut, maintenant</b></h3>
                                <div className="form-group radio-group">
                                    <StyledRadioGroup field="activityType" id="activityType">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <label htmlFor="activityType">Votre activité:</label>
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
                                <div className="form-group radio-group">
                                    <StyledRadioGroup field="purpose" id="purpose">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <label htmlFor="kitchenOwner">J'utiliserai cette cuisine pour ...</label>
                                                <li> <StyledRadio group={group} value="catering" id="catering" label="Assurer mon service de traiteur" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="entreprise" id="entreprise" label="Lancer mon entreprise / mon produit / ma gamme" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="workshop" id="workshop" label="Organiser un atelier culinaire" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="upscaling" id="upscaling" label="Accroitre ma production" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="delivery" id="delivery" label="Créer un restaurant avec livraison au consommateur" className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                <div id="userinfo-select" className="form-group" style={{ marginLeft: '0' }} >
                                    <StyledSelect field="region" id="region" style={{ marginLeft: '0' }}
                                        options={regionOptions} />
                                </div>
                                <div className="form-group" >
                                    <StyledTextArea className="form-control" placeholder="Vos commentaires" style={{ width: '100%' }} rows="4" field="comments" id="comments" />
                                </div>
                                <div className="form-group has-feedback" >
                                    <StyledText className="form-control" placeholder="Numéro de téléphone " type="text" field="phone" id="phone" />
                                </div>
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">Submit</button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={errorTitle}
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div>

        )
    }
    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

const mapStateToProps = state => {
    return {
        lang: state.user.lang
    }
}

const mapDispatchToProps = dispatch => {
    return {
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