import React, { Component } from 'react';
import { Form, StyledText, TextArea, StyledRadio, StyledRadioGroup, StyledCheckbox, StyledSelect } from 'react-form';
import "../styles/forms.css";

const capacityOptions = [];
const hourOptions = [];
for (let index = 1; index < 21; index++) {
    capacityOptions.push({ label: String(index), value: String(index) });
}
for (let index = 0; index < 25; index++) {
    hourOptions.push({ label: String(index), value: String(index) });
}

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    errorValidator = (values) => {
        const validateType = (type) => {
            return !type ? 'Type de bien est requis' : null;
        };
        const validatePhone = (phone) => {
            return !phone ? 'Numéro de téléphone est requis' : null;
        };
        const validateAddress = (address) => {
            return !address ? 'Adresse du bien est requis' : null;
        };
        const validateAFSCA = (AFSCA) => {
            return !AFSCA ? "Numéro d'unité d'établissement est requis" : null;
        };
        const validateSize = (size) => {
            return !size ? "Superficie du bien est requis" : null;
        };
        const validatePrice = (price) => {
            return !price ? "Prix est requis" : null;
        };
        return {
            type: validateType(values.type),
            phone: validatePhone(values.phone),
            address: validateAddress(values.address),
            AFSCA: validateAFSCA(values.AFSCA),
            size: validateSize(values.size),
            price: validatePrice(values.price)
        };
    }

    warningValidator = (values) => {

        const validateSize = (size) => {
            return size && (size < 1 || size > 1000) ? 'Superficie non valide' : null;
        };
        const validatePrice = (price) => {
            return price && (price < 5 || price > 200) ? 'Prix non valide' : null;
        };
        const validateRent = (rent) => {
            return rent && (rent < 200 || rent > 20000 || isNaN(rent)) ? 'Prix non valide' : null;
        };

        return {
            size: validateSize(values.size),
            price: validatePrice(values.price),
            rent: validateRent(values.rent)
        };
    }

    successValidator = (values, errors) => {
        const validateEmail = () => {
            return !errors.email ? '' : null;
        };
        const validatePassword = () => {
            return !errors.password ? '' : null;
        };
        return {
            email: validateEmail(values.email),
            password: validatePassword(values.password)
        };
    }

    submit = (submittedValues) => {
        console.log(submittedValues);
        /*       let url = '/api/users/register';
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
                   .catch(err => console.log(err));*/
    }
    render = () => {
        return (
            <Form
                validateError={this.errorValidator}
                validateWarning={this.warningValidator}
                //validateSuccess={this.successValidator}
                onSubmit={this.submit}>
                {formApi => (
                    <form onSubmit={formApi.submitForm} id="form2" className="form-container">
                        <h4>Formulaire location de cuisine</h4>
                        <p style={{ textAlign: "justify" }}> Vous cherchez à diminuer vos frais fixes et augmenter votre rentabilité ?
                    <br />
                            Louez votre cuisine les moments durant laquelle vous ne l'utilisez pas !<br />
                            Merci de remplir ce formulaire pour nous aider à publier votre annonce.<br />
                            Ce petit formulaire ne vous engage en rien, il nous permet tout simplement d'obtenir des informations complémentaires sur votre bien.
                            <br /><br />

                            Si vous avez une question, contactez nous au 02.223/10.37<br />
                            Ou bien sur <a href="mailto:contact@co-oking.be">contact@co-oking.be</a>
                        </p>
                        <div className="input-div" >
                            <label htmlFor="name">Nom du bien</label>
                            <StyledText type="text" field="name" id="name" />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="phone">Votre numéro de téléphone</label>
                            <StyledText type="text" field="phone" id="phone" />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="description">Descriptif du bien </label>
                            <TextArea style={{ width: '100%' }} rows="4" field="description" id="description" />
                        </div>
                        <div className="input-div" style={{ height: '150px' }}>
                            <label>Type de bien:</label>
                            <StyledRadioGroup field="type">
                                {group => (
                                    <ul className="radio-grid" >
                                        <li> <StyledRadio group={group} value="kitchen" id="kitchen" label="Cuisine laboratoire" className="d-inline-block" /> </li>
                                        <li> <StyledRadio group={group} value="sharedkitchen" id="sharedkitchen" label="Cuisine laboratoire partagée" className="d-inline-block" /> </li>
                                        <li> <StyledRadio group={group} value="restaurant" id="restaurant" label="Cuisine de restaurant" className="d-inline-block" /> </li>
                                        <li> <StyledRadio group={group} value="collectiverestaurant" id="collectiverestaurant" label="Cuisine de restaurant collective" className="d-inline-block" /> </li>
                                    </ul>
                                )}
                            </StyledRadioGroup>
                        </div>
                        <div className="input-div" >
                            <label htmlFor="address">Adresse du bien</label>
                            <StyledText type="text" field="address" id="address" />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="size">Superficie du bien (en m2)</label>
                            <StyledText type="number" field="size" id="size" />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="AFSCA">Numéro d'unité d'établissement (AFSCA)</label>
                            <StyledText type="number" field="AFSCA" id="AFSCA" />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="VAT">Numéro de TVA</label>
                            <StyledText type="number" field="VAT" id="VAT" />
                        </div>
                        <label htmlFor="hours">Heures de disponibilité</label>
                        <div className="input-div-hours" >
                            <StyledSelect field="hours1" id="hours1" options={hourOptions} />
                            &nbsp;&nbsp;-&nbsp;&nbsp;
                            <StyledSelect field="hours2" id="hours2" options={hourOptions} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="capacity">Nombre de personnes pouvant travailler en cuisine</label>
                            <StyledSelect field="capacity" id="capacity" options={capacityOptions} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="price">Prix à l'heure (HTVA)</label>
                            <StyledText type="number" field="price" id="price" />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="rent">Prix au mois pour un entrepreneur (une équipe de 2 personnes max) (HTVA)</label>
                            <StyledText type="number" field="rent" id="rent" />
                        </div>
                        <label htmlFor="equipment">Equipements disponibles:</label>
                        <div className="input-div-checkbox" >
                            <ul className="checkbox-grid">
                                <li>  <StyledCheckbox field="parking" id="parking" label="Parking" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="toilets" id="toilets" label="Toilettes" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="fridge" id="fridge" label="Frigo" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="bainMarie" id="bain-marie" label="Bain marie" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="mixer" id="mixer" label="Batteur" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="electronicCashier" id="electronic-cashier" label="Caisse électronique" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="coolingCell" id="cooling-cell" label="Cellule de refroidissement" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="nColdRoom" id="n-cold-room" label="Chambre froide négative" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="pColdRoom" id="p-cold-room" label="Chambre froide positive" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="etuve" id="etuve" label="Etuve" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="extraction" id="extraction" label="Extraction" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="oven" id="oven" label="Four" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="pizzaOven" id="pizza-oven" label="Four a pizza" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="fryer" id="fryer" label="Friteuse" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="grill" id="grill" label="Grill" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="juicer" id="juicer" label="Machine a jus" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="pastaMachine" id="pasta-machine" label="Machine à pates" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="mixMachine" id="mix-machine" label="Machine à pétrin" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="sauceMachine" id="sauce-machin" label="Machine à sauce" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="vacuumMachine" id="vacuum-machine" label="Machine sous-vide" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="microwave" id="microwave" label="Micro-onde" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="piano" id="piano" label="Piano" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="workplan" id="workplan" label="Plan de travail" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="griddle" id="griddle" label="Plancha" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="ceramicHob" id="ceramic-hob" label="Plaque vitrocéramique" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="induction" id="induction" label="Plaques à induction" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="dishwasher" id="dishwasher" label="Lave vaisselle" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="sink" id="sink" label="Plonge manuelle" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="threePhase" id="three-phase" label="Prises électriques triphasées" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="cleaningProducts" id="cleaning-products" label="Produits d’entretien" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="baker" id="baker" label="Robot patissier" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="sauteuse" id="sauteuse" label="Sauteuse" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="freezer" id="freezer" label="Surgelateur" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="tableware" id="tableware" label="Vaisselle de salle" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="vmc" id="vmc" label="VMC" className="d-inline-block" /></li>
                                <li>  <StyledCheckbox field="displays" id="displays" label="Présentoirs" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="slicer" id="slicer" label="Trancheuse" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="dryStorage" id="dry-storage" label="Stockage sec (étagères)" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="smallEquipment" id="small-equipment" label="Petit matériel (cul de poule, ustensiles...)" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="furniture" id="furniture" label="Mobilier de salle (tables, chaises...)" className="d-inline-block" /> </li>
                                <li>  <StyledCheckbox field="ownEquipment" id="own-equipment" label="Possibilité d’apporter son matériel (sous conditions)" className="d-inline-block" /> </li>
                            </ul>
                        </div>
                        <label htmlFor="price">Services disponibles (en option payante pour le locataire):</label>
                        <div className="input-div" style={{ height: '80px' }}>
                            <ul className="checkbox-grid">
                                <li> <StyledCheckbox field="cookstaff" id="cookstaff" label="Personnel de cuisine" className="d-inline-block" /></li>
                                <li> <StyledCheckbox field="roomstaff" id="roomstaff" label="Personnel de salle" className="d-inline-block" /> </li>
                                <li> <StyledCheckbox field="dishwashers" id="dishwashers" label="Commis/ plongeur" className="d-inline-block" /> </li>
                                <li> <StyledCheckbox field="cleaning" id="cleaning" label="Service de nettoyage" className="d-inline-block" /></li>
                                <li> <StyledCheckbox field="storage" id="storage" label="Service de stockage" className="d-inline-block" /> </li>
                                <li> <StyledCheckbox field="refrigeratorVehicle" id="refrigerator-vehicle" label="Véhicule réfrigéré" className="d-inline-block" /> </li>
                                <li> <StyledCheckbox field="reception" id="reception" label="Réception de marchandises" className="d-inline-block" /> </li>
                            </ul>
                        </div>
                        <div htmlFor="cancellation" className="input-div">
                            <label>Vos conditions d'annulation:</label>
                            <StyledRadioGroup field="cancellation">
                                {group => (
                                    <ul className="radio-grid" >
                                        <li> <StyledRadio group={group} value="fexible" id="fexible" label="Flexible: remboursement à hauteur de 50% jusqu'à 48h avant la réservation" className="d-inline-block" /> </li>
                                        <li> <StyledRadio group={group} value="moderate" id="moderate" label="Modérée: Remboursement à hauteur de 50% jusqu'à 7 jours avant la réservation" className="d-inline-block" /> </li>
                                        <li> <StyledRadio group={group} value="strict" id="strict" label="Stricte: Remboursement à hauteur de 50% jusqu'à 30 jours avant la réservation" className="d-inline-block" /> </li>
                                    </ul>
                                )}
                            </StyledRadioGroup>
                        </div>
                        <div htmlFor="events" className="input-div">
                            <label>Espace disponible pour évènement?</label>
                            <StyledRadioGroup onChange={(e) => { this.setState({ events: e }); console.log(e) }} field="events">
                                {group => (
                                    <ul className="radio-grid" >
                                        <li> <StyledRadio group={group} value="true" id="true" label="Oui" className="d-inline-block" /> </li>
                                        <li> <StyledRadio group={group} value="false" id="false" label="Non" className="d-inline-block" /> </li>
                                    </ul>
                                )}
                            </StyledRadioGroup>
                        </div>
                        {this.state.events === "true" ? (
                            <div className="input-div" >
                                <label htmlFor="event-capacity1">Capacité debout pour évènement:</label>
                                <StyledText type="number" field="eventCapacity1" id="event-capacity1" />
                                <label htmlFor="event-capacity2">Capacité assis pour évènement:</label>
                                <StyledText type="number" field="eventCapacity2" id="event-capacity2" />
                            </div>
                        ) : null}
                        <div className="input-div" >
                            <button id="submit" type="submit" className="mb-4 btn btn-warning">Register Kitchen</button>
                        </div>
                        <div id="header_spacing"></div>
                    </form>
                )}
            </Form>

        )
    }
}

export default StyledForm;