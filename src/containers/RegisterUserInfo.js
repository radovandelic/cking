import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, StyledText, StyledTextArea, StyledRadioGroup, StyledRadio, StyledSelect } from "react-form";
import { Popup } from "../components";
import { updateUser, updateInfo } from "../actions";
import { register, regions, weekDays, popup } from "../data/translations";
import "../styles/forms.css";

class StyledForm extends Component {

    constructor(props) {
        const { type, lang } = props;
        super(props);
        this.state = {
            type: type || "",
            redirect: false,
            overlay: "overlay off",
            popup: {
                message: popup[lang].errorMessageConnect,
            },
        };
    }

    onTypeChange = (e) => {
        this.setState({ type: e });
    }

    errorValidator = (values) => {
        const { type } = this.state;
        const validateActivity = (activity) => {
            return !activity ? "Activity type is required." : null;
        };
        const validateDateFrom = (dateFrom) => {
            return !dateFrom && type && type !== "recurring" ? "Start date is required" : null;
        };
        const validateDateTo = (dateTo) => {
            return !dateTo && type && type !== "recurring" ? "End date is required" : null;
        };
        const validateDaysFrom = (daysFrom) => {
            return !daysFrom && type === "recurring" ? "Start day is required" : null;
        };
        const validateDaysTo = (daysTo) => {
            return !daysTo && type === "recurring" ? "End day is required" : null;
        };
        const validateHoursFrom = (hoursFrom) => {
            return !hoursFrom && type && type !== "long" ? "Start hour is required" : null;
        };
        const validateHoursTo = (hoursTo) => {
            return !hoursTo && type && type !== "long" ? "End hour is required" : null;
        };
        const validateTime = (values) => {
            const { type } = this.state;
            if (type && type !== "recurring") {
                let today = new Date();
                today -= today % 86400000; // set time to midnight
                today = new Date(today);
                const dateFrom = new Date(values.dateFrom);
                const dateTo = new Date(values.dateTo);
                const totalDays = (dateTo - dateFrom) / 86400000;
                if (totalDays < 0 || dateFrom < today) return "Invalid timeframe selected.";
            }
            if (type === "recurring") {
                const daysFrom = Number(values.daysFrom) || 7;
                const daysTo = Number(values.daysTo) || 7;
                if (daysFrom > daysTo) return "Invalid timeframe selected.";
            }
            if (type && type !== "long") {
                const hoursFrom = Number(values.hoursFrom);
                const hoursTo = Number(values.hoursTo);
                if (hoursTo - hoursFrom <= 0) return "Invalid timeframe selected.";
            }
            return null;
        };

        return {
            activity: validateActivity(values.activity),
            dateFrom: validateDateFrom(values.dateFrom),
            dateTo: validateDateTo(values.dateTo),
            daysFrom: validateDaysFrom(values.daysFrom),
            daysTo: validateDaysTo(values.daysTo),
            hoursFrom: validateHoursFrom(values.hoursFrom),
            hoursTo: validateHoursTo(values.hoursTo),
            time: validateTime(values),
        };
    }

    formatDefaultValues = (values) => {
        for (const v in values) {
            if (values.hasOwnProperty(v)) {
                values[v] = String(values[v]);
            }
        }
        return values;
    }

    formatData = (values) => {
        const type = values.type;
        values.hoursFrom = !isNaN(values.hoursFrom) && type !== "long" ? Number(values.hoursFrom) : undefined;
        values.hoursTo = !isNaN(values.hoursTo) && type !== "long" ? Number(values.hoursTo) : undefined;
        values.daysFrom = !isNaN(values.daysFrom) && type === "recurring" ? Number(values.daysFrom) : undefined;
        values.daysTo = !isNaN(values.daysTo) && type === "recurring" ? Number(values.daysTo) : undefined;
        values.dateFrom = type !== "recurring" ? values.dateFrom : undefined;
        values.dateTo = type !== "recurring" ? values.dateTo : undefined;
        return values;
    }

    submit = (submittedValues) => {
        const { updateInfo, access_token, lang } = this.props;
        submittedValues = this.formatData(submittedValues);
        const url = "http://0.0.0.0:9000/api/infos/";
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ ...submittedValues, access_token }),
        };
        fetch(url, query)
            .then(res => res.json())
            .then(data => {
                updateInfo(data);
                this.setState({
                    overlay: "overlay on",
                    popup: {
                        title: popup[lang].successTitle,
                        message: "Your request has been forwarded to the Cookwork team. You should receive a response soon.",
                    },
                });
            })
            .catch(err => this.setState({
                overlay: "overlay on",
                popup: { title: popup[lang].errorTitle, message: popup[lang].errorMessageConnect },
            }));

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

    populateInputs = (lang) => {
        const regionOptions = [], dayOptions = [], hourOptions = [];
        let i = 1;

        regionOptions.push({
            label: register[lang].your + register[lang].region,
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
        for (const day in weekDays[lang]) {
            dayOptions.push({
                label: weekDays[lang][day],
                value: i < 7 ? String(i) : String(0),
            });
            i++;
        }
        for (let index = 0; index < 24 + 1; index++) {
            hourOptions.push({ label: String(index) + ":00", value: String(index) });
        }

        return { regionOptions, dayOptions, hourOptions };
    }

    render = () => {
        const { user, lang } = this.props;
        const { region } = this.props.match.params;
        const { type } = this.state;
        const { regionOptions, dayOptions, hourOptions } = this.populateInputs(lang);

        let { info } = this.props;
        info = info.id ? this.formatDefaultValues(info) : {};
        info = Object.assign(info, {
            region,
            phone: info.phone || user.phone || "",
            activity: info.activity || user.activity || "",
        });
        return (
            this.state.redirect ?
                <Redirect push to={this.state.redirect} />
                :
                <div>
                    <Form
                        defaultValues={info}
                        validateError={this.errorValidator}
                        onSubmitFailure={this.onSubmitFailure}
                        onSubmit={this.submit}>
                        {formApi => (
                            <form onSubmit={formApi.submitForm} id="form" className="form-container">
                                <h3><b>Trouvez la cuisine qu'il vous faut, maintenant</b></h3>
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
                                <div id="userinfo-select" className="form-group" style={{ marginLeft: "0" }} >
                                    <StyledSelect field="region" id="region" style={{ marginLeft: "0" }}
                                        options={regionOptions} />
                                </div>
                                <div className="form-group has-feedback" >
                                    <StyledText className="form-control" placeholder="Numéro de téléphone " type="text" field="phone" id="phone" />
                                </div> <h3>Utilisation unique: date et heures</h3>
                                <div className="form-group radio-group">
                                    <StyledRadioGroup field="type" id="type" onChange={this.onTypeChange} >
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="once" id="once" label="One time" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="recurring" id="recurring" label="Recurring" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="long" id="long" label="Long term (6 months or longer)" className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                {type ? type !== "recurring" ?
                                    <div className="inline">
                                        <div className="form-group form-group-date" >
                                            <label htmlFor="dateFrom">Start date:</label>
                                            <StyledText type="date" field="dateFrom" id="dateFrom" className="form-control" />
                                        </div>
                                        <div className="form-group form-group-date" >
                                            <label htmlFor="dateTo">End date:</label>
                                            <StyledText type="date" field="dateTo" id="dateTo" className="form-control" />
                                        </div>
                                    </div>
                                    :
                                    <div className="inline">
                                        <div className="form-group form-group-date">
                                            <label htmlFor="daysFrom">Start day:</label>
                                            <StyledSelect field="daysFrom" id="daysFrom" options={dayOptions} />
                                        </div>
                                        <div className="form-group form-group-date">
                                            <label htmlFor="daysTo">End day:</label>
                                            <StyledSelect field="daysTo" id="daysTo" options={dayOptions} />
                                        </div>
                                    </div>
                                    : null}
                                {type && type !== "long" ?
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
                                    <StyledTextArea className="form-control" placeholder="Vos commentaires" style={{ width: "100%" }} rows="4" field="comments" id="comments" />
                                </div>
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">Submit</button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <Popup overlay={this.state.overlay}
                        title={this.state.popup.title}
                        message={this.state.popup.message}
                        btn="ok"
                        close={this.closePopup} />
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
    user: state.user,
    access_token: state.user.access_token,
    lang: state.user.lang,
    info: state.info,
    type: state.info.type,
});

const mapDispatchToProps = dispatch => ({
    updateUser: (user) => dispatch(updateUser(user)),
    updateInfo: (info) => dispatch(updateInfo(info)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StyledForm);