import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, StyledText, StyledTextArea, StyledRadio, StyledRadioGroup, StyledCheckbox, StyledSelect } from 'react-form';
import { Popup } from '../components';
import { updateKitchen } from '../actions';
import { weekDays, register, registerKitchen, staff, type, errors } from '../data/translations';
import "../styles/forms.css";

const capacityOptions = [];
const hourOptions = [];
for (let index = 1; index < 21; index++) {
    capacityOptions.push({ label: String(index), value: String(index) });
}
for (let index = 0; index < 25; index++) {
    hourOptions.push({ label: String(index) + ":00", value: String(index) });
}

const regionOptions = [
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

const equipment = [
    "parking", "toilets", "fridge", "bainMarie", "mixer", "electronicCashier", "coolingCell", "nColdRoom",
    "pColdRoom", "etuve", "extraction", "oven", "pizzaOven", "fryer", "grill", "juicer", "pastaMachine",
    "mixMachine", "sauceMachine", "vacuumMachine", "microwave", "piano", "workplan", "griddle", "ceramicHob", "induction",
    "dishwasher", "sink", "threePhase", "cleaningProducts", "baker", "sauteuse", "freezer", "tableware", "vmc",
    "displays", "slicer", "dryStorage", "smallEquipment", "furniture", "ownEquipment"
]

const successMessage = "Your kitchen has been updated."

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultValues: {},
            overlay: "overlay",
            redirect: false,
            popup: {
                message: successMessage,
                btn: "ok",
                title: "Success"
            }
        };
    }

    errorValidator = (values) => {
        const { lang } = this.props;
        const validateName = (name) => {
            if (!name || !name.trim()) return registerKitchen[lang].name + errors[lang].required;
            return name && name.length < 3 ? 'Le nom doit comporter plus de 3 caractères.' : null;
        };
        const validateType = (type) => {
            if (!type || !type.trim()) return registerKitchen[lang].type + errors[lang].required;
        };
        const validatePhone = (phone) => {
            if (!phone || !phone.trim()) return registerKitchen[lang].phone + errors[lang].required;
        };
        const validateAddress = (address) => {
            if (!address || !address.trim()) return registerKitchen[lang].address + errors[lang].required;
        };
        const validatePostalCode = (postalCode) => {
            if (!postalCode || !String(postalCode).trim()) return registerKitchen[lang].postalCode + errors[lang].required;
            return postalCode && (String(postalCode).length !== 4) ? registerKitchen[lang].postalCode + errors[lang].invalid : null;
        };
        const validateRegion = (region) => {
            if (!region || !region.trim()) return registerKitchen[lang].region + errors[lang].required;
        };
        const validateVAT = (VAT) => {
            if (!VAT || !VAT.trim()) return registerKitchen[lang].VAT + errors[lang].required;
        };
        const validateSize = (size) => {
            if (!size || !String(size).trim()) return registerKitchen[lang].size + errors[lang].required;
            return size && (size < 1 || size > 1000) ? registerKitchen[lang].size + errors[lang].invalid : null;
        };
        const validatePrice = (price) => {
            if (!price || !String(price).trim()) return registerKitchen[lang].price + errors[lang].required;
            return price && (price < 15 || price > 200) ? registerKitchen[lang].price + errors[lang].invalid : null;
        };
        const validateDays = (daysFrom, daysTo) => {
            if (!daysFrom || !daysTo) return registerKitchen[lang].days + errors[lang].required;
            return daysFrom && daysTo && ((daysFrom > daysTo && daysTo !== '0') || (daysFrom === '0' && daysTo !== '0'))
                ? registerKitchen[lang].days + errors[lang].invalid : null;
        };
        const validateHours = (hoursFrom, hoursTo) => {
            if (!hoursFrom || !hoursTo) return registerKitchen[lang].hours + errors[lang].required;
            return hoursFrom && hoursTo && hoursFrom >= hoursTo ? registerKitchen[lang].hours + errors[lang].invalid : null;
        };
        const validateAgree = (agree) => {
            if (!agree) return errors[lang].agree;
        };
        return {
            name: validateName(values.name),
            type: validateType(values.type),
            phone: validatePhone(values.phone),
            address: validateAddress(values.address),
            postalCode: validatePostalCode(values.postalCode),
            region: validateRegion(values.region),
            VAT: validateVAT(values.VAT),
            size: validateSize(values.size),
            price: validatePrice(values.price),
            daysmsg: validateDays(values.daysFrom, values.daysTo),
            hoursmsg: validateHours(values.hoursFrom, values.hoursTo),
            agree: validateAgree(values.agree)
        };
    }

    warningValidator = (values) => {
        const validateRent = (rent) => {
            return rent && (rent < 100 || rent > 20000 || isNaN(rent)) ? 'Prix non valide' : null;
        };
        return {
            rent: validateRent(values.rent)
        };
    }

    successValidator = (values, errors) => {
        const validatePrice = () => {
            return !errors.price ? '* CookWork prend une commission de 15% sur les réservations effectuées sur sa plateforme à intégrer qu prix total.' : null;
        };
        return {
            price: validatePrice(values.price)
        };
    }

    formatData = (submittedValues) => {
        submittedValues.events = Boolean(submittedValues.events) || undefined;
        submittedValues.size = Number(submittedValues.size);
        submittedValues.price = Number(submittedValues.price);
        submittedValues.rent = Number(submittedValues.rent) || undefined;
        submittedValues.capacity = Number(submittedValues.capacity) || undefined;
        submittedValues.standingCapacity = Number(submittedValues.standingCapacity) || undefined;
        submittedValues.sittingCapacity = Number(submittedValues.sittingCapacity) || undefined;
        submittedValues.hours = {
            hoursFrom: Number(submittedValues.hoursFrom) || undefined,
            hoursTo: Number(submittedValues.hoursTo) || undefined
        }
        submittedValues.days = {
            daysFrom: Number(submittedValues.daysFrom) || undefined,
            daysTo: Number(submittedValues.daysTo) || undefined
        }
        submittedValues.equipment = {}
        submittedValues.staff = {}

        // place equipment booleans inside equipment object
        for (let e of equipment) {
            if (submittedValues[e]) {
                submittedValues.equipment[e] = submittedValues[e];
                submittedValues[e] = undefined;
            }
        }

        // place staff booleans inside staff object
        for (let s in staff) {
            if (submittedValues[s]) {
                submittedValues.staff[s] = submittedValues[s];
                submittedValues[s] = undefined;
            }
        }
        return submittedValues;
    }

    submit = (submittedValues) => {
        const { updateKitchen } = this.props;
        const { kitchen, user } = this.props;
        submittedValues = this.formatData(submittedValues);
        submittedValues.access_token = user.access_token;
        let url = `http://0.0.0.0:9000/api/kitchens/${kitchen.id}/`;
        let query = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(submittedValues)
        }
        fetch(url, query)
            .then(res => res.json())
            .then(data => {
                updateKitchen(data);
                this.setState({
                    overlay: "overlay on",
                    popup: {
                        message: successMessage,
                        title: "Success",
                        btn: "ok"
                    }
                })
            })
            .catch(err => {
                this.setState({
                    overlay: "overlay on",
                    popup: {
                        message: "There has been an error connecting to the server. Please try again later.",
                        title: "Error",
                        btn: "ok"
                    }
                })
            });
    }

    formatDefaultValues = (kitchen) => {
        if (!kitchen.id) {
            return this.setState({ redirect: '/registerkitchen' })
        }
        if (kitchen.events) {
            kitchen.events = "true";
        }
        for (let id in kitchen.equipment) {
            kitchen[id] = kitchen.equipment[id]; //format object so it's readable by the form
        }

        for (let id in kitchen.staff) {
            kitchen[id] = kitchen.staff[id]; //format object so it's readable by the form
        }
        if (kitchen.hours) {
            kitchen.hoursTo = String(kitchen.hours.hoursTo);
            kitchen.hoursFrom = String(kitchen.hours.hoursFrom);
        }
        if (kitchen.days) {
            kitchen.daysTo = String(kitchen.days.daysTo);
            kitchen.daysFrom = String(kitchen.days.daysFrom);
        }
        kitchen.capacity = String(kitchen.capacity);
        return kitchen;
    }

    onSubmitFailure = (errors) => {
        for (let err in errors) {
            if (errors[err]) {
                var e = document.getElementById(err);
                if (err === "type" || err === "agree") e.scrollIntoView(true);
                else e.focus();
                window.scrollBy(0, -120);
                break;
            }
        }
    }

    render = () => {
        const { lang } = this.props;
        let { kitchen } = this.props;
        kitchen = this.formatDefaultValues(kitchen);
        kitchen.agree = true;
        const dayOptions = []
        const StaffOptions = []
        let i = 1;
        for (let day in weekDays[lang]) {
            dayOptions.push({
                label: weekDays[lang][day],
                value: i < 7 ? String(i) : String(0)
            })
            i++;
        }
        for (const s in staff[lang]) {
            StaffOptions.push(
                <li key={staff[lang][s]} > <StyledCheckbox field={s} id={s} label={staff[lang][s]} className="d-inline-block" /></li>
            )
        }

        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        validateError={this.errorValidator}
                        validateWarning={this.warningValidator}
                        validateSuccess={this.successValidator}
                        defaultValues={kitchen} onSubmitFailure={this.onSubmitFailure}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container">
                                <h4>{registerKitchen[lang].title}</h4>
                                <p style={{ textAlign: "justify" }}>
                                    {registerKitchen[lang].paragraph5}<br />
                                    {registerKitchen[lang].paragraph6} <a href="mailto:contact@co-oking.be">contact@co-oking.be</a>
                                </p>
                                <div className="form-group" >
                                    <label htmlFor="name">{registerKitchen[lang].name}</label>
                                    <StyledText className="form-control" type="text" field="name" id="name" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="phone">{registerKitchen[lang].phone}</label>
                                    <StyledText className="form-control" type="text" field="phone" id="phone" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="description">{registerKitchen[lang].description}</label>
                                    <StyledTextArea className="form-control" style={{ width: '100%' }} rows="4" field="description" id="description" />
                                </div>
                                <div className="form-group" id="type" style={{ height: '150px' }}>
                                    <label>{registerKitchen[lang].type}</label>
                                    <StyledRadioGroup field="type">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="kitchen" id="kitchen" label={type[lang].kitchen} className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="sharedkitchen" id="sharedkitchen" label={type[lang].sharedkitchen} className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="restaurant" id="restaurant" label={type[lang].restaurant} className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="collectiverestaurant" id="collectiverestaurant" label={type[lang].collectiverestaurant} className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="address">{registerKitchen[lang].address}</label>
                                    <StyledText className="form-control" type="text" field="address" id="address" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="postalCode">{registerKitchen[lang].postalCode}</label>
                                    <StyledText className="form-control" type="number" field="postalCode" id="postalCode" min="1000" max="9999" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="region">{registerKitchen[lang].region}</label>
                                    <StyledSelect type="text" field="region" id="region"
                                        options={regionOptions} />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="size">{registerKitchen[lang].size}</label>
                                    <StyledText className="form-control" type="number" field="size" id="size" min="1" max="2000" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="AFSCA">{registerKitchen[lang].AFSCA}</label>
                                    <StyledText className="form-control" type="text" field="AFSCA" id="AFSCA" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="VAT">{registerKitchen[lang].VAT}</label>
                                    <StyledText className="form-control" type="text" field="VAT" id="VAT" />
                                </div>
                                <label htmlFor="days">{registerKitchen[lang].days}</label>
                                <div className="form-group form-group-hours" >
                                    <StyledSelect field="daysFrom" id="daysFrom" options={dayOptions} />
                                    &nbsp;&nbsp;-&nbsp;&nbsp;
                                    <StyledSelect field="daysTo" id="daysTo" options={dayOptions} />
                                </div>
                                <div className="hiddn">
                                    <StyledText type="hidden" field="daysmsg" id="daysmsg" />
                                </div>
                                <label htmlFor="hours">{registerKitchen[lang].hours}</label>
                                <div className="form-group form-group-hours" >
                                    <StyledSelect field="hoursFrom" id="hoursFrom" options={hourOptions} />
                                    &nbsp;&nbsp;-&nbsp;&nbsp;
                                    <StyledSelect field="hoursTo" id="hoursTo" options={hourOptions} />
                                </div>
                                <div className="hiddn">
                                    <StyledText type="hidden" field="hoursmsg" id="hoursmsg" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="capacity">{registerKitchen[lang].capacity}</label>
                                    <StyledSelect field="capacity" id="capacity" options={capacityOptions} />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="price">{registerKitchen[lang].price}</label>
                                    <StyledText className="form-control" type="number" field="price" id="price" min="15" max="200" />
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="rent">{registerKitchen[lang].rent}</label>
                                    <StyledText className="form-control" type="number" field="rent" id="rent" min="100" max="20000" />
                                </div>
                                <label htmlFor="equipment">{registerKitchen[lang].equipment}</label>
                                <div className="form-group-checkbox" >
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
                                        <li>  <StyledCheckbox field="furniture" id="furniture" label="Mobilier de salle (tables, chaises...)" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox field="smallEquipment" id="small-equipment" label="Petit matériel (cul de poule, ustensiles...)" className="d-inline-block" /> </li>
                                        {/* <li> &nbsp;</li> */}
                                        {/* <li> &nbsp;</li> */}
                                        <li>  <StyledCheckbox field="ownEquipment" id="own-equipment" label="Possibilité d’apporter son matériel (sous conditions)" className="d-inline-block" /> </li>
                                    </ul>
                                </div>
                                <label htmlFor="staff">{registerKitchen[lang].staff}</label>
                                <div className="form-group" style={{ height: '80px' }}>
                                    <ul className="checkbox-grid">
                                        {StaffOptions}
                                    </ul>
                                </div>
                                <div htmlFor="cancellation" className="form-group" style={{ height: '140px' }}>
                                    <label>{registerKitchen[lang].cancellation}</label>
                                    <StyledRadioGroup field="cancellation" key={lang} >
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="flexible" id="fexible" label={registerKitchen[lang].flexible} className="d-inline-block cancellation-item" /> </li>
                                                <li> <StyledRadio group={group} value="moderate" id="moderate" label={registerKitchen[lang].moderate} className="d-inline-block cancellation-item" /> </li>
                                                <li> <StyledRadio group={group} value="strict" id="strict" label={registerKitchen[lang].strict} className="d-inline-block cancellation-item" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                <div htmlFor="events" className="form-group">
                                    <label>{registerKitchen[lang].events}</label>
                                    <StyledRadioGroup onChange={(e) => { kitchen.events = e }} field="events">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="true" id="true" label={registerKitchen[lang].yes} className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="" id="false" label={registerKitchen[lang].no} className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                {this.props.kitchen.events ? (
                                    <div className="form-group" >
                                        <label htmlFor="standingCapacity">{registerKitchen[lang].capacityStanding}</label>
                                        <StyledText className="form-control" type="number" field="standingCapacity" id="standing-capacity" />
                                        <label htmlFor="standingCapacity">{registerKitchen[lang].capacitySitting}</label>
                                        <StyledText className="form-control" type="number" field="sittingCapacity" id="sitting-capacity" />
                                    </div>
                                ) : null}
                                <div className="form-group" id="terms" >
                                    <StyledCheckbox field="agree" id="agree"
                                        label={
                                            <span>{register[lang].agree0}
                                                <a href="/terms" target="_blank" rel="noopener noreferrer">
                                                    {register[lang].agree1}
                                                </a>
                                            </span>} />
                                </div>
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">{registerKitchen[lang].submitUpdate}</button>
                                </div>
                                <div id="header_spacing"></div>
                            </form>
                        )
                        }
                    </Form>

                    <Popup message={this.state.popup.message}
                        btn={this.state.popup.btn}
                        title={this.state.popup.title}
                        overlay={this.state.overlay}
                        close={this.closePopup} />
                </div>
        )
    }
    closePopup = (e) => {
        let redirect = this.state.popup.title === "Success" ? "/dashboard" : false;
        this.setState({ overlay: 'overlay off', redirect: redirect })
    }
}

const mapStateToProps = state => {
    return {
        kitchen: state.kitchen,
        user: state.user,
        lang: state.user.lang
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateKitchen: (kitchen) => {
            dispatch(updateKitchen(kitchen));
        }
    }
}

StyledForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledForm)

export default StyledForm;