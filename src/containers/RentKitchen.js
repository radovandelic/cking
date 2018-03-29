import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, StyledText, StyledSelect, StyledRadioGroup, StyledRadio } from 'react-form';
import { Popup } from '../components';
import { weekDays } from '../data/translations';
import "../styles/forms.css";

var errorMessageConnect = "There has been an error connecting to the server. Please try again later.";

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            type: "once",
            price: 0,
            rent: -1,
            hours: {
                hoursFrom: 0,
                hoursTo: 24
            },
            days: {
                daysFrom: 1,
                daysTo: 0
            },
            hourOptions: [],
            message: "",
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect
            }
        };
    }

    componentWillMount = () => {
        const { id } = this.props.match.params;
        const hourOptions = [];
        let url = 'http://0.0.0.0:9000/api/kitchens/' + id;
        let query = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }
        fetch(url, query)
            .then(res => res.json())
            .then(data => {
                const hours = data.hours && data.hours.hoursFrom && data.hours.hoursTo ? data.hours : { hoursFrom: 0, hoursTo: 24 }
                const days = data.days && data.days.daysFrom && data.days.daysTo ? data.days : { daysFrom: 1, daysTo: 0 }
                const price = data.price
                const rent = data.rent ? data.rent : -1
                for (let index = hours.hoursFrom; index < hours.hoursTo + 1; index++) {
                    hourOptions.push({ label: String(index) + ":00", value: String(index) });
                }
                this.setState({ hourOptions, hours, days, price, rent })
            })

    }

    errorValidator = (values) => {
        const { price } = this.state;
        const validateDateFrom = (dateFrom) => {
            return !dateFrom ? 'Start date is required' : null
        }
        const validateDateTo = (dateTo) => {
            return !dateTo ? 'End date is required' : null
        }
        const validateTime = (values) => {
            const { days } = this.state;
            days.daysTo = days.daysTo === 0 ? 7 : days.daysTo;
            days.daysFrom = days.daysFrom === 0 ? 7 : days.daysFrom;
            const today = new Date()
            const dateFrom = new Date(values.dateFrom)
            const dateTo = new Date(values.dateTo)
            const hoursFrom = Number(values.hoursFrom)
            const hoursTo = Number(values.hoursTo)
            /* let weekDay = dateFrom.getDay()
            weekDay = weekDay === 0 ? 7 : weekDay; */
            let totalHours = hoursTo - hoursFrom;
            let totalDays = 0;
            let totalPrice = 0
            if (totalDays < 0 || dateFrom < today) return 'Invalid timeframe selected.';
            if (totalHours <= 0) return 'Invalid timeframe selected.';

            // why did they have to set sunday to zero ugh
            for (let i = dateFrom.valueOf(); i <= dateTo; i += 86400000) {
                var day = new Date(i);
                var weekDay = day.getDay() !== 0 ? day.getDay() : 7;
                if (weekDay >= days.daysFrom && weekDay <= days.daysTo) {
                    totalDays++;
                }
            }
            totalHours *= totalDays;
            totalPrice = (totalHours * price)
            totalPrice += 0.15 * totalPrice
            return !isNaN(totalHours) ?
                `The price for the selected time period (${totalHours} hours) is €${totalPrice} (€${price}/h + 15% service fee)`
                : "";
        };

        this.setState({ message: validateTime(values) })
        return {
            dateFrom: validateDateFrom(values.dateFrom),
            dateTo: validateDateTo(values.dateTo)
        };
    }

    submit = (submittedValues) => {
        console.log(submittedValues)
        /*let url = 'http://0.0.0.0:9000/api/users/register';
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

    onTypeChange = (e) => {
        this.setState({ type: e })
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
        const { type, hourOptions, days, rent, message } = this.state;
        const { lang } = this.props;

        let i = 1;
        const dayOptions = []
        days.daysTo = days.daysTo === 0 ? 7 : days.daysTo;
        for (let day in weekDays[lang]) {
            if (i >= days.daysFrom && i <= days.daysTo)
                dayOptions.push({
                    label: weekDays[lang][day],
                    value: i < 7 ? String(i) : String(0)
                })
            i++;
        }

        return (
            this.state.redirect ?
                <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        defaultValues={{ type: "once" }}
                        validateError={this.errorValidator}
                        onSubmitFailure={this.onSubmitFailure}
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
                                                    <li> <StyledRadio group={group} value="once" id="once" label="One time" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="recurring" id="recurring" label="Recurring" className="d-inline-block" /> </li>
                                                    <li> <StyledRadio group={group} value="long" id="long" label="Long term (minimum 1 month)" className="d-inline-block" /> </li>
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
                                            <label htmlFor="dateFrom">From:</label>
                                            <StyledText type="date" field="dateFrom" id="dateFrom" style={{ width: '85%', height: '31px' }} />
                                        </div>
                                        <div className="form-group" >
                                            <label htmlFor="dateTo">To:</label>
                                            <StyledText type="date" field="dateTo" id="dateTo" style={{ width: '85%', height: '31px' }} />
                                        </div>
                                    </div>
                                    :
                                    <div className="inline">
                                        <div className="form-group" >
                                            <label htmlFor="daysFrom">From:</label>
                                            <StyledSelect field="daysFrom" id="daysFrom" options={dayOptions} style={{ width: '85%' }} />
                                        </div>
                                        <div className="form-group" >
                                            <label htmlFor="daysTo">To:</label>
                                            <StyledSelect field="daysTo" id="daysTo" options={dayOptions} style={{ width: '85%' }} />
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
                                    <h4 className={message === 'Invalid timeframe selected.' ? "react-form-message-error" : ""} >
                                        {message}
                                    </h4>
                                </div>
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">Place order</button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay} title={"Error"}
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

StyledForm = connect(
    mapStateToProps,
    null
)(StyledForm)

export default StyledForm;