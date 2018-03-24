import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, StyledText, StyledSelect } from 'react-form';
import { Popup } from '../components';
import "../styles/forms.css";

var errorMessageConnect = "There has been an error connecting to the server. Please try again later.";

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            price: 0,
            hours: {
                hoursFrom: 0,
                hoursTo: 24
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
                const hours = data.hours.hoursFrom && data.hours.hoursTo ? data.hours : { hoursFrom: 0, hoursTo: 24 }
                const price = data.price
                for (let index = hours.hoursFrom; index < hours.hoursTo + 1; index++) {
                    hourOptions.push({ label: String(index) + ":00", value: String(index) });
                }
                this.setState({ hourOptions, hours, price })
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
            const today = new Date()
            const dateFrom = new Date(values.dateFrom)
            const dateTo = new Date(values.dateTo)
            const hoursFrom = Number(values.hoursFrom)
            const hoursTo = Number(values.hoursTo)
            let totalHours = 0
            let totalDays = (dateTo - dateFrom) / 86400000;
            let totalPrice = 0
            if (totalDays < 0 || dateFrom < today) return 'Invalid timeframe selected.';
            if (totalDays === 0 && hoursFrom >= hoursTo) return 'Invalid timeframe selected.';
            if (totalDays === 0) {
                totalHours = hoursTo - hoursFrom
            } else {
                totalHours = (this.state.hours.hoursTo - this.state.hours.hoursFrom) * totalDays
                totalHours += hoursTo - hoursFrom
            }
            totalPrice = (totalHours * price) + 0.15 * (totalHours * price)
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
        const { hourOptions, message } = this.state;
        return (
            this.state.redirect ?
                <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        validateError={this.errorValidator}
                        onSubmitFailure={this.onSubmitFailure}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container">
                                <h3>Utilisation unique: date et heures</h3>
                                <div className="inline">
                                    <div className="form-group" >
                                        <label htmlFor="dateFrom">From:</label>
                                        <StyledText type="date" field="dateFrom" id="dateFrom" />
                                    </div>
                                    <div className="form-group" >
                                        <label htmlFor="dateTo">To:</label>
                                        <StyledText type="date" field="dateTo" id="dateTo" />
                                    </div>
                                </div>
                                <div className="inline">
                                    <div className="form-group" >
                                        <label htmlFor="dateFrom">From:</label>
                                        <StyledSelect field="hoursFrom" id="hoursFrom" options={hourOptions} />
                                    </div>
                                    <div className="form-group" >
                                        <label htmlFor="dateTo">To:</label>
                                        <StyledSelect field="hoursTo" id="hoursTo" options={hourOptions} />
                                    </div>
                                </div>
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

export default StyledForm;