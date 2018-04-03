import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Form, StyledText, StyledSelect, StyledRadioGroup, StyledRadio } from "react-form";
import { Popup } from "../components";
import { weekDays, popup } from "../data/text";
import "../styles/forms.css";

class StyledForm extends Component {

    constructor(props) {
        const { lang } = props;
        super(props);
        this.state = {
            kitchen: {
                id: props.match.params.id,
                name: "",
                address: "",
            },
            redirect: false,
            type: "once",
            price: 0,
            rent: -1,
            hours: {
                hoursFrom: 0,
                hoursTo: 24,
            },
            days: {
                daysFrom: 1,
                daysTo: 0,
            },
            totalDays: -1,
            totalHours: -1,
            totalPrice: -1,
            message: "",
            overlay: "overlay off",
            popup: {
                title: popup[lang].errorTitle,
                message: popup[lang].errorMessageConnect,
            },
        };
    }
    populateOptions = (lang) => {
        const { days, hours } = this.state;
        const dayOptions = [], hourOptions = [];
        let i = 1;

        days.daysTo = days.daysTo === 0 ? 7 : days.daysTo;
        for (const day in weekDays[lang]) {
            if (i >= days.daysFrom && i <= days.daysTo)
                dayOptions.push({
                    label: weekDays[lang][day],
                    value: i < 7 ? String(i) : String(0),
                });
            i++;
        }
        for (let index = hours.hoursFrom; index < hours.hoursTo + 1; index++) {
            hourOptions.push({ label: String(index) + ":00", value: String(index) });
        }

        return { dayOptions, hourOptions };
    }

    componentWillMount = () => {
        const { id } = this.props.match.params;
        const url = "http://0.0.0.0:9000/api/kitchens/" + id;
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "GET",
        };
        fetch(url, query)
            .then(res => res.json())
            .then(data => {
                const kitchen = { id: data.id, name: data.name, address: data.address, postalCode: data.postalCode, region: data.region };
                const hours = data.hours && data.hours.hoursFrom && data.hours.hoursTo ? data.hours : { hoursFrom: 0, hoursTo: 24 };
                const days = data.days && data.days.daysFrom && data.days.daysTo ? data.days : { daysFrom: 1, daysTo: 0 };
                const price = data.price;
                const rent = data.rent ? data.rent : -1;
                this.setState({ hours, days, price, rent, kitchen });
            });

    }

    errorValidator = (values) => {
        const { type } = this.state;
        const validateDateFrom = (dateFrom) => {
            return !dateFrom && type !== "recurring" ? "Start date is required" : null;
        };
        const validateDateTo = (dateTo) => {
            return !dateTo && type !== "recurring" ? "End date is required" : null;
        };
        const validateDaysFrom = (daysFrom) => {
            return !daysFrom && type === "recurring" ? "Start day is required" : null;
        };
        const validateDaysTo = (daysTo) => {
            return !daysTo && type === "recurring" ? "End day is required" : null;
        };
        const validateHoursFrom = (hoursFrom) => {
            return !hoursFrom && type !== "long" ? "Start hour is required" : null;
        };
        const validateHoursTo = (hoursTo) => {
            return !hoursTo && type !== "long" ? "End hour is required" : null;
        };
        const validateTime = (values) => {
            const { type } = this.state;
            if (type !== "recurring") {
                let today = new Date();
                today -= today % 86400000; // set time to midnight
                today = new Date(today);
                const dateFrom = new Date(values.dateFrom);
                const dateTo = new Date(values.dateTo);
                const totalDays = (dateTo - dateFrom) / 86400000;
                if (totalDays < 0 || dateFrom < today) return "Invalid timeframe selected.";
                if (type === "long" && totalDays < 180) return "The minimum timeframe for long term rent is 6 months.";
            }
            if (type === "recurring") {
                const daysFrom = Number(values.daysFrom) || 7;
                const daysTo = Number(values.daysTo) || 7;
                if (daysFrom > daysTo) return "Invalid timeframe selected.";
            }
            if (type !== "long") {
                const hoursFrom = Number(values.hoursFrom);
                const hoursTo = Number(values.hoursTo);
                if (hoursTo - hoursFrom <= 0) return "Invalid timeframe selected.";
            }
            return null;
        };

        return {
            dateFrom: validateDateFrom(values.dateFrom),
            dateTo: validateDateTo(values.dateTo),
            daysFrom: validateDaysFrom(values.daysFrom),
            daysTo: validateDaysTo(values.daysTo),
            hoursFrom: validateHoursFrom(values.hoursFrom),
            hoursTo: validateHoursTo(values.hoursTo),
            time: validateTime(values),
        };
    }

    successValidator = (values, errors) => {
        const validateTime = (values) => {
            const { type, days, price } = this.state;
            days.daysTo = days.daysTo || 7;
            days.daysFrom = days.daysFrom || 7;

            const dateFrom = new Date(values.dateFrom);
            const dateTo = new Date(values.dateTo);
            const hoursFrom = Number(values.hoursFrom);
            const hoursTo = Number(values.hoursTo);
            let totalHours = hoursTo - hoursFrom;
            let totalPrice = 0;
            let totalDays = 0;

            switch (type) {
                case "once":
                    for (let i = dateFrom.valueOf(); i <= dateTo; i += 86400000) {
                        const day = new Date(i);
                        const weekDay = day.getDay() !== 0 ? day.getDay() : 7;
                        if (weekDay >= days.daysFrom && weekDay <= days.daysTo) {
                            totalDays++;
                        }
                    }
                    totalHours *= totalDays;
                    totalPrice = (totalHours * price);
                    totalPrice += 0.15 * totalPrice;
                    this.setState({ totalDays, totalHours, totalPrice });
                    return !isNaN(totalHours) && totalPrice > 0 ?
                        `The estimated price for the selected time period (${totalHours} hours) is €${totalPrice} (€${price}/h + 15% service fee, VAT excluded)`
                        : "";
                case "recurring":
                    const daysFrom = Number(values.daysFrom) || 7;
                    const daysTo = Number(values.daysTo) || 7;

                    totalDays = (daysTo - daysFrom) + 1;
                    totalHours *= totalDays;
                    totalPrice = totalHours * price;
                    totalPrice += 0.15 * totalPrice;
                    this.setState({ totalDays, totalHours, totalPrice });
                    return !isNaN(totalPrice) && totalPrice > 0 ?
                        `The estimated price for the selected time period (${totalHours} hours) is €${totalPrice}/week (€${price}/h + 15% service fee, VAT excluded)`
                        : "";
                case "long":
                    const { rent } = this.state;
                    totalDays = (dateTo - dateFrom) / 86400000;

                    const totalMonths = Math.round(totalDays / 30);
                    totalPrice = totalMonths * rent;
                    totalPrice += 0.15 * totalPrice;
                    this.setState({ totalDays, totalHours, totalPrice });
                    return !isNaN(totalPrice) && totalPrice > 0 ?
                        `The estimated price for the selected time period (${totalMonths} months) is €${totalPrice} (€${rent}/month + 15% service fee, VAT excluded)`
                        : "";
                default:
                    return null;
            }
        };
        if (!errors.time) {
            this.setState({ message: validateTime(values) });
        } else {
            this.setState({ message: "" });
        }
        return null;
    }

    submit = (submittedValues) => {
        const { access_token, lang } = this.props;
        submittedValues.access_token = access_token;
        submittedValues.kitchen = this.state.kitchen;
        submittedValues.kitchen.price = this.state.price;
        submittedValues.kitchen.rent = this.state.rent !== -1 ? this.state.rent : undefined;
        submittedValues.totalDays = this.state.totalDays;
        submittedValues.totalHours = this.state.totalHours;
        submittedValues.totalPrice = this.state.totalPrice;
        submittedValues.type = this.state.type;

        const url = "http://0.0.0.0:9000/api/orders";
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(submittedValues),
        };

        fetch(url, query)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    overlay: "overlay on",
                    popup: {
                        title: popup[lang].successTitle,
                        message: "You have successfully placed an order. You will receive a reply from Cookwork soon.",
                    },
                });
            })
            .catch(err => this.setState({ overlay: "overlay on", popup: { message: popup[lang].errorMessageConnect } }));

    }

    onTypeChange = (e) => {
        this.setState({ type: e });
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

    render = () => {
        const { lang } = this.props;
        const { type, hours, price, rent, message } = this.state;
        const { dayOptions, hourOptions } = this.populateOptions(lang);

        return (
            this.state.redirect ?
                <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        defaultValues={{ type: "once" }}
                        validateError={this.errorValidator}
                        onSubmitFailure={this.onSubmitFailure}
                        validateSuccess={this.successValidator}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container">
                                <h3>Utilisation unique: date et heures</h3>
                                <div className="form-group radio-group">
                                    <StyledRadioGroup field="type" id="type" onChange={this.onTypeChange} key={rent} >
                                        {group => (
                                            rent !== -1 ?
                                                <ul className="radio-grid" >
                                                    <label htmlFor="type">Interval type: </label>
                                                    <li> <StyledRadio group={group} value="once" id="once" label={`One time (€${price}/h + 15%)`} className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="recurring" id="recurring" label={`Recurring (€${price}/h + 15%)`} className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="long" id="long" label={`Long term (€${rent}/month + 15%, minimum 6 months)`} className="d-inline-block" /> </li>
                                                </ul>
                                                :
                                                <ul className="radio-grid" >
                                                    <label htmlFor="type">Interval type: </label>
                                                    <li> <StyledRadio group={group} value="once" id="once" label="One time" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="recurring" id="recurring" label="Recurring" className="d-inline-block" /> </li>
                                                </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                {type !== "recurring" ?
                                    <div className="inline">
                                        <div className="form-group" >
                                            <label htmlFor="dateFrom">Start date:</label>
                                            <StyledText type="date" field="dateFrom" id="dateFrom" style={{ width: "85%", height: "31px" }} />
                                        </div>
                                        <div className="form-group" >
                                            <label htmlFor="dateTo">End date:</label>
                                            <StyledText type="date" field="dateTo" id="dateTo" style={{ width: "85%", height: "31px" }} />
                                        </div>
                                    </div>
                                    :
                                    <div className="inline">
                                        <div className="form-group" >
                                            <label htmlFor="daysFrom">Start day:</label>
                                            <StyledSelect field="daysFrom" id="daysFrom" options={dayOptions} style={{ width: "85%" }} />
                                        </div>
                                        <div className="form-group" >
                                            <label htmlFor="daysTo">End day:</label>
                                            <StyledSelect field="daysTo" id="daysTo" options={dayOptions} style={{ width: "85%" }} />
                                        </div>
                                    </div>
                                }
                                {type !== "long" ?
                                    <div className="inline">
                                        <div className="form-group" >
                                            <label htmlFor="hoursFrom">From:</label>
                                            <StyledSelect field="hoursFrom" id="hoursFrom" options={hourOptions} />
                                        </div>
                                        <div className="form-group" >
                                            <label htmlFor="hoursTo">To:</label>
                                            <StyledSelect field="hoursTo" id="hoursTo" options={hourOptions} />
                                        </div>
                                        <div className="form-group" >
                                        </div>
                                        <div className="form-group" >
                                        </div>
                                    </div>
                                    : null}
                                <div className="form-group" >
                                    <StyledText type="hidden" field="time" id="time" />
                                </div>
                                <div className="form-group" >
                                    {message ? <h4> {message} </h4> : null}
                                </div>
                                <h4 >This Kitchen's availability is from {dayOptions[0].label} to {dayOptions[dayOptions.length - 1].label},&nbsp;
                                    {hours.hoursFrom}:00 to {hours.hoursTo}:00. </h4>
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">Place order</button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={this.state.popup.title}
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div>

        );
    }
    closePopup = () => {
        const { lang } = this.props;
        const redirect = this.state.popup.title === popup[lang].successTitle ? "/dashboard" : false;
        this.setState({ overlay: "overlay off", redirect });
    }
}

const mapStateToProps = state => ({
    access_token: state.user.access_token,
    lang: state.user.lang,
});

export default connect(
    mapStateToProps,
    null
)(StyledForm);
