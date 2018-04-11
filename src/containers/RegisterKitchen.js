import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, StyledRadio, StyledRadioGroup, StyledCheckbox } from "react-form";
import base64 from "base-64";
import { TextInput, Radio, Select, CheckBox, Popup } from "../components";
import { updateKitchen } from "../actions";
import { maps } from "../data";
import { registerKitchen, register, region, equipment, staff, type, cancellation, weekDays, popup, errors } from "../data/text";
import "../styles/forms.css";

class StyledForm extends Component {

    constructor(props) {
        const { lang } = props;
        super(props);
        this.state = {
            overlay: "overlay",
            redirect: false,
            popup: {
                message: (<p>
                    {popup[lang].successMessageRegister1} <br />
                    {popup[lang].successMessageRegister2} <br /><br />
                    {popup[lang].successMessageRegister3}
                </p>),
                btn: "yesno",
                title: popup[lang].successTitle,
            },
        };
    }

    errorValidator = (values) => {
        const { lang } = this.props;

        const validateType = (type) => {
            return !type || !type.trim() ? registerKitchen[lang].type + errors[lang].required : null;
        };
        const validatePhone = (phone) => {
            return !phone || !phone.trim() ? registerKitchen[lang].phone + errors[lang].required : null;
        };
        const validateAddress = (address) => {
            return !address || !address.trim() ? registerKitchen[lang].address + errors[lang].required : null;
        };
        const validatePostalCode = (postalCode) => {
            return !postalCode || !String(postalCode).trim() ? registerKitchen[lang].postalCode + errors[lang].required
                : String(postalCode).length !== 4 ? registerKitchen[lang].postalCode + errors[lang].invalid
                    : null;
        };
        const validateRegion = (region) => {
            return !region || !region.trim() ? registerKitchen[lang].region + errors[lang].required : null;
        };
        const validateVAT = (VAT) => {
            return !VAT || !VAT.trim() ? registerKitchen[lang].VAT + errors[lang].required : null;
        };
        const validateSize = (size) => {
            return !size || !String(size).trim() ? registerKitchen[lang].size + errors[lang].required
                : size && (size < 1 || 2000 < size) ? registerKitchen[lang].size + errors[lang].invalid
                    : null;
        };
        const validatePrice = (price) => {
            return !price || !String(price).trim() ? registerKitchen[lang].price + errors[lang].required
                : price < 15 || price > 500 ? registerKitchen[lang].price + errors[lang].invalid
                    : null;
        };
        const validateRentPrice = (price) => {
            return price && (price < 100 || 50000 < price) ? registerKitchen[lang].price + errors[lang].invalid
                : null;
        };
        const validateDays = (daysFrom, daysTo) => {
            if (!daysFrom || !daysTo) return registerKitchen[lang].days + errors[lang].required;
            daysFrom = Number(daysFrom) || 7;
            daysTo = Number(daysTo) || 7;
            return daysFrom && daysTo && (daysFrom > daysTo) ? registerKitchen[lang].days + errors[lang].invalid : null;
        };
        const validateHours = (hoursFrom, hoursTo) => {
            return (!hoursFrom || !hoursTo) ? registerKitchen[lang].hours + errors[lang].required
                : Number(hoursFrom) >= Number(hoursTo) ? registerKitchen[lang].hours + errors[lang].invalid
                    : null;
        };
        const validateAgree = (agree) => {
            return !agree ? errors[lang].agree : null;
        };
        return {
            type: validateType(values.type),
            phone: validatePhone(values.phone),
            address: validateAddress(values.address),
            postalCode: validatePostalCode(values.postalCode),
            region: validateRegion(values.region),
            VAT: validateVAT(values.VAT),
            size: validateSize(values.size),
            price: validatePrice(values.price),
            rent: validateRentPrice(values.rent),
            daysmsg: validateDays(values.daysFrom, values.daysTo),
            hoursmsg: validateHours(values.hoursFrom, values.hoursTo),
            agree: validateAgree(values.agree),
        };
    }

    successValidator = (values, errors) => {
        const { lang } = this.props;
        const validatePrice = () => {
            return !errors.price ? registerKitchen[lang].commissionNotif : null;
        };
        const validateRent = (rent) => {
            return rent && !errors.rent ? registerKitchen[lang].commissionNotif : null;
        };

        return {
            price: validatePrice(),
            rent: validateRent(values.rent),
        };
    }

    formatData = (submittedValues) => {
        submittedValues.events = Boolean(submittedValues.events);
        submittedValues.size = Number(submittedValues.size);
        submittedValues.price = Number(submittedValues.price);
        submittedValues.rent = Number(submittedValues.rent) || undefined;
        submittedValues.capacity = Number(submittedValues.capacity) || undefined;
        submittedValues.standingCapacity = Number(submittedValues.standingCapacity) || undefined;
        submittedValues.sittingCapacity = Number(submittedValues.sittingCapacity) || undefined;
        submittedValues.hours = {
            hoursFrom: Number(submittedValues.hoursFrom) || 0,
            hoursTo: Number(submittedValues.hoursTo) || 24,
        };
        submittedValues.days = {
            daysFrom: Number(submittedValues.daysFrom) || 1,
            daysTo: Number(submittedValues.daysTo) || 0,
        };
        submittedValues.equipment = {};
        submittedValues.staff = {};

        // place equipment booleans inside equipment object
        for (const e of equipment.map) {
            if (submittedValues[e]) {
                submittedValues.equipment[e] = submittedValues[e];
                delete submittedValues[e];
            }
        }

        // place staff booleans inside staff object
        for (const s of staff.map) {
            if (submittedValues[s]) {
                submittedValues.staff[s] = submittedValues[s];
                delete submittedValues[s];
            }
        }

        return submittedValues;
    }

    submit = (submittedValues) => {
        const { updateKitchen, access_token, lang } = this.props;
        submittedValues = this.formatData(submittedValues);
        submittedValues.access_token = access_token;
        submittedValues = JSON.stringify(submittedValues);

        try { base64.encode(submittedValues); } catch (err) {
            return this.setState({
                overlay: "overlay on",
                popup: {
                    message: "The entered information contains unsupported characters. Please revise.",
                    title: popup[lang].errorTitle,
                    btn: "ok",
                },
            });
        }

        const url = "http://0.0.0.0:9000/api/kitchens";
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: submittedValues,
        };
        fetch(url, query)
            .then(res => {
                base64.encode(submittedValues);
                return res.json();
            })
            .then(data => {
                updateKitchen(data);
                this.setState({
                    overlay: "overlay on",
                    popup: {
                        message: (<p>
                            {popup[lang].successMessageRegister1} <br />
                            {popup[lang].successMessageRegister2} <br /><br />
                            {popup[lang].successMessageRegister3}
                        </p>),
                        title: popup[lang].successTitle,
                        btn: "yesno",
                    },
                });
            })
            .catch(err => {
                this.setState({
                    overlay: "overlay on",
                    popup: {
                        message: popup[lang].errorMessageConnect,
                        title: popup[lang].errorTitle,
                        btn: "ok",
                    },
                });
            });
    }

    onSubmitFailure = (errors) => {
        for (const err in errors) {
            if (errors[err]) {
                const e = document.getElementById(err);
                if (err === "hoursmsg" || err === "daysmsg") {
                    e.scrollIntoView(true);
                    window.scrollBy(0, -200);
                    return;
                }
                if (err === "type" || err === "agree") e.scrollIntoView(true); // because e.focus() doesn't work on checkbox and radio
                else e.focus();
                window.scrollBy(0, -120);
                return;
            }
        }
    }

    populateOptions = (lang) => {
        const options = {
            capacity: [],
            hours: [],
            region: [],
            days: [],
            staff: [],
        };
        let i = 1;

        for (let index = 1; index < 21; index++) options.capacity.push({ label: String(index), value: String(index) });
        for (let index = 0; index < 25; index++) options.hours.push({ label: String(index) + ":00", value: String(index) });

        options.region.push({
            label: register[lang].your + register[lang].region,
            value: "",
            disabled: true,
        });
        for (const r in region[lang]) {
            if (region[lang].hasOwnProperty(r) && r !== "all") {
                options.region.push({
                    label: region[lang][r],
                    value: r,
                });
            }
        }

        for (const day in weekDays[lang]) {
            options.days.push({
                label: weekDays[lang][day],
                value: i < 7 ? String(i) : String(0),
            });
            i++;
        }

        return options;
    }

    render = () => {
        const { lang, defaultRegion, phone } = this.props;
        const options = this.populateOptions(lang);
        const Inputs = [];
        for (const field of maps.registerKitchen) {
            Inputs.push(field.type === "select" ?
                <Select id={field.id} label={registerKitchen[lang][field.id]} time={field.time} options={options[field.id]} key={field.id} />
                :
                <TextInput id={field.id} label={registerKitchen[lang][field.id]} type={field.type} key={field.id} />
            );
        }

        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        defaultValues={{ region: defaultRegion, phone }}
                        validateError={this.errorValidator}
                        validateSuccess={this.successValidator}
                        onSubmitFailure={this.onSubmitFailure}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container" key={lang}>
                                <h4>{registerKitchen[lang].title}</h4>
                                <p style={{ textAlign: "justify" }}>
                                    {registerKitchen[lang].paragraph1}<br />
                                    {registerKitchen[lang].paragraph2}<br />
                                    {registerKitchen[lang].paragraph3}<br />
                                    {registerKitchen[lang].paragraph4}<br />
                                    <br /><br />

                                    {registerKitchen[lang].paragraph5}<br />
                                    {registerKitchen[lang].paragraph6} <a href="mailto:contact@co-oking.be">contact@co-oking.be</a>
                                </p>
                                {Inputs.slice(0, 3)}

                                <Radio id="type" label={registerKitchen[lang].type} labels={type[lang]} options={type.map} />

                                {Inputs.slice(3)}

                                <CheckBox options={equipment.map} label={registerKitchen[lang].equipment} labels={equipment[lang]} />
                                <CheckBox options={staff.map} label={registerKitchen[lang].staff} labels={staff[lang]} />
                                <Radio id="cancellation" label={registerKitchen[lang].cancellation} labels={cancellation[lang]} options={cancellation.map} />

                                <div className="form-group">
                                    <label htmlFor="events">{registerKitchen[lang].events}?</label>
                                    <StyledRadioGroup onChange={(e) => { this.setState({ events: Boolean(e) }); }} field="events">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="true" id="true" label={registerKitchen[lang].yes} className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="" id="false" label={registerKitchen[lang].no} className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                {this.state.events === true ? (
                                    <div>
                                        <TextInput id="standingCapacity" label={registerKitchen[lang].capacityStanding} type="number" />
                                        <TextInput id="sittingCapacity" label={registerKitchen[lang].capacitySitting} type="number" />
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
                                    <button id="submit" type="submit" className="btn btn-orange">{registerKitchen[lang].submit}</button>
                                </div>
                                <div id="header_spacing"></div>
                            </form>

                        )}
                    </Form>

                    <Popup message={this.state.popup.message}
                        btn={this.state.popup.btn}
                        title={this.state.popup.title}
                        overlay={this.state.overlay}
                        close={this.closePopup} yes="/uploadimage" no="/dashboard" />
                </div>
        );
    }
    closePopup = (e) => {
        const redirect = e.target.value || false;
        this.setState({ overlay: "overlay off", redirect: redirect });
    }
}

const mapStateToProps = state => ({
    access_token: state.user.access_token,
    defaultRegion: state.user.region || "",
    phone: state.user.phone || "",
    lang: state.user.lang,
});

const mapDispatchToProps = dispatch => ({
    updateKitchen: (kitchen) => dispatch(updateKitchen(kitchen)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledForm);