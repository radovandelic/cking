import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Form } from "react-form";
import { Popup, Radio, TextInput, Select } from "../components";
import { weekDays, order, popup, errors } from "../data/text";
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
                const price = +(data.price * 1.2).toFixed(2); // base price + service fee, rounded to 2 decimals
                const rent = +(data.rent * 1.2).toFixed(2) || -1; // base price + service fee, rounded to 2 decimals
                this.setState({ hours, days, price, rent, kitchen });
            });

    }

    errorValidator = (values) => {
        const { type } = this.state;
        const { lang } = this.props;
        const msg = errors[lang];

        const validateDateFrom = (dateFrom) => {
            return !dateFrom && type !== "recurring" ? msg.req : null;
        };
        const validateDateTo = (dateTo) => {
            return !dateTo && type !== "recurring" ? msg.req : null;
        };
        const validateDaysFrom = (daysFrom) => {
            return !daysFrom && type === "recurring" ? msg.req : null;
        };
        const validateDaysTo = (daysTo) => {
            return !daysTo && type === "recurring" ? msg.req : null;
        };
        const validateHoursFrom = (hoursFrom) => {
            return !hoursFrom && type !== "long" ? msg.req : null;
        };
        const validateHoursTo = (hoursTo) => {
            return !hoursTo && type !== "long" ? msg.req : null;
        };
        const validateTime = (values) => {
            const { type } = this.state;
            const dateFrom = new Date(values.dateFrom);
            const dateTo = new Date(values.dateTo);
            const daysFrom = Number(values.daysFrom) || 7;
            const daysTo = Number(values.daysTo) || 7;
            if (type !== "recurring") {
                let today = new Date();
                today -= today % 86400000; // set time to midnight
                today = new Date(today);
                const totalDays = (dateTo - dateFrom) / 86400000;
                if (totalDays < 0 || dateFrom < today) return msg.time;
                if (type === "long" && totalDays < 180) return `${msg.minimumMonths} 6 ${order[lang].months}`;
            }
            if (type === "recurring") {
                if (daysFrom > daysTo) return msg.time;
            }
            if (type !== "long") {
                const hoursFrom = Number(values.hoursFrom);
                const hoursTo = Number(values.hoursTo);
                const totalDays = type === "once" ? (dateTo - dateFrom) / 86400000 + 1 : daysTo - daysFrom + 1;
                const totalHours = totalDays * (hoursTo - hoursFrom);
                if (totalHours <= 0) return msg.time;
                if (totalHours < 4) return msg.minimum;
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
        const { lang } = this.props;
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
                    totalPrice = totalHours * price;
                    this.setState({ totalDays, totalHours, totalPrice });
                    return !isNaN(totalHours) && totalPrice > 0 ?
                        `${order[lang].estimate} (${totalHours} ${order[lang].hours}) ${lang === "fr" ? "est" : "is"} €${+(totalPrice * 1.21).toFixed(2)} (€${price}/h + 21% ${order[lang].VAT})`
                        : "";
                case "recurring":
                    const daysFrom = Number(values.daysFrom) || 7;
                    const daysTo = Number(values.daysTo) || 7;

                    totalDays = (daysTo - daysFrom) + 1;
                    totalHours *= totalDays;
                    totalPrice = totalHours * price;
                    this.setState({ totalDays, totalHours, totalPrice });
                    return !isNaN(totalPrice) && totalPrice > 0 ?
                        `${order[lang].estimate} (${totalHours} ${order[lang].hours}) ${lang === "fr" ? "est" : "is"} €${+(totalPrice * 1.21).toFixed(2)}/${order[lang].week} (€${price}/h + 21% ${order[lang].VAT})`
                        : "";
                case "long":
                    const { rent } = this.state;
                    totalDays = (dateTo - dateFrom) / 86400000;

                    const totalMonths = Math.round(totalDays / 30);
                    totalPrice = totalMonths * rent;
                    this.setState({ totalDays, totalHours, totalPrice });
                    return !isNaN(totalPrice) && totalPrice > 0 ?
                        `${order[lang].estimate} (${totalMonths} ${order[lang].months}) ${lang === "fr" ? "est" : "is"} €${+(totalPrice * 1.21).toFixed(2)} (€${rent}/month + 21% ${order[lang].VAT})`
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
        submittedValues.totalPrice = +this.state.totalPrice.toFixed(2);
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
                        message: order[lang].successMessage,
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
        const text = order[lang];
        const radioOptions = rent !== -1 ? ["once", "recurring", "long"] : ["once", "recurring"];
        const radioLabels = {
            once: `${text.once} (€${price}/h + ${order[lang].VAT})`,
            recurring: `${text.recurring} (€${price}/h + ${order[lang].VAT})`,
            long: `${text.long} (€${rent}/${text.month} + ${order[lang].VAT}, minimum 6 ${text.months})`,
        };

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
                            <form onSubmit={formApi.submitForm} id="form" className="form-container" key={lang + price}>
                                <h3>{text.title}</h3>
                                <Radio id="type" options={radioOptions} labels={radioLabels} onChange={this.onTypeChange} key={rent} />
                                {type !== "recurring" ?
                                    <div className="inline">
                                        <TextInput id="dateFrom" label={text.dateFrom} type="date" />
                                        <TextInput id="dateTo" label={text.dateTo} type="date" />
                                    </div>
                                    :
                                    <div className="inline">
                                        <Select id="daysFrom" options={dayOptions} label={text.daysFrom} className="form-group form-group-date" />
                                        <Select id="daysTo" options={dayOptions} label={text.daysTo} className="form-group form-group-date" />
                                    </div>
                                }
                                {type !== "long" ?
                                    <div className="inline">
                                        <Select id="hoursFrom" label={text.from} options={hourOptions} />
                                        <Select id="hoursTo" label={text.to} options={hourOptions} />
                                        <div className="form-group" />
                                        <div className="form-group" />
                                    </div>
                                    : null}
                                <TextInput id="time" type="hidden" />
                                <div className="form-group" >
                                    {message ? <h4> {message} </h4> : null}
                                </div>
                                <h4>{`${text.availability} ${text.from} ${dayOptions[0].label} ${text.to} ${dayOptions[dayOptions.length - 1].label}, 
                                    ${hours.hoursFrom}:00 ${text.to} ${hours.hoursTo}:00. `}</h4>
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">{text.submit}</button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={this.state.popup.title}
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div >

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
