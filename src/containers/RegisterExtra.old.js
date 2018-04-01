import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, StyledText, StyledRadioGroup, StyledRadio, StyledTextArea } from "react-form";
import { Popup } from "../components";
import { updateUser } from "../actions";
import "../styles/forms.css";

const errorMessageConnect = "There has been an error connecting to the server. Please try again later.";

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect,
            },
        };
    }

    errorValidator = (values) => {
        const validateFirstName = (firstName) => {
            if (!firstName || !firstName.trim()) return "First name is required.";
            return firstName.length < 2 ? "First name must be longer than 2 characters." : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
        };
    }

    submit = (submittedValues) => {
        /* const { updateUser } = this.props;
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
                if (typeof (Storage) !== undefined) {
                    window.localStorage.setItem("access_token", data.token);
                    window.localStorage.setItem("user", JSON.stringify(base64.encode(data.user)));
                }
                data.user.access_token = data.token;
                updateUser(data.user);
                this.setState({ redirect: '/dashboard' });
            })
            .catch(err => this.setState({ overlay: "overlay on" }));*/

    }
    render = () => {
        return (
            this.state.redirect ?
                <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        validateError={this.errorValidator}
                        onSubmit={this.submit} onSubmitFailure={e => { console.log(e); }}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container">

                                <h4>Trouvez un job en Extra ou comme Chef </h4>
                                <p style={{ textAlign: "justify" }}>
                                    Remplissez cette série de questions pour vous inscrire sur CookWork<br />
                                    Ajoutez une photo pour finaliser votre inscription et avoir plus de chance d'être retenu.<br />
                                    Dès que votre profil est validé, il se trouvera sur Cookwok avec plein d'autres extras. Bon travail!<br />
                                </p>
                                <div className="input-div" style={{ height: "150px" }}>
                                    <label>Quel type d'activité recherchez-vous?</label>
                                    <StyledRadioGroup field="type">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="extra" id="extra" label="Extra" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="fixe" id="fixe" label="Fixe" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="chef" id="chef" label="Chef sous-traitant" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="plonge" id="plonge" label="Plonge" className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                <div className="input-div" >
                                    <label htmlFor="experience">Votre expérience                </label>
                                    <p>EXEMPLE: Fonction: Chef de partie; Nom de la société: Etiquette; Pendant combien de temps: 3 ans;
                                        Ville, Pays: Bruxelles, Belgique; Site web de la société:
                                    <a href="https://www.etiquette.be"> www.etiquette.be</a>;
                                        Description du job: Commandes, mise en place, service, plan de nettoyage...</p>
                                    <StyledTextArea style={{ width: "100%" }} rows="5" field="experience" id="experience" />
                                </div>
                                <div className="input-div" >
                                    <label htmlFor="VAT">Votre numéro de TVA </label>
                                    <p>Si vous êtes indépendant, tout sera plus simple pour la facturation et donnera encore plus
                                        confiance à la personne qui demande des services</p>
                                    <StyledText type="text" field="VAT" id="VAT" />
                                </div>
                                <div className="input-div" >
                                    <button id="submit" type="submit" className="btn btn-orange">Register</button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={"Error"}
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div>

        );
    }
    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

const mapDispatchToProps = dispatch => ({
    updateUser: (user) => dispatch(updateUser(user)),
});

export default connect(
    null,
    mapDispatchToProps
)(StyledForm);