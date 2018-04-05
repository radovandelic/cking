import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, StyledText, StyledRadioGroup, StyledRadio, StyledSelect } from "react-form";
import { TextInput, Select, Popup } from "../components";
import { updateUser, updateInfo } from "../actions";
import { register, registerUserInfo, orderType, region, weekDays, popup, errors } from "../data/text";
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
        const { lang } = this.props;
        const { type } = this.state;
        const msg = errors[lang];

        const validateActivity = (activity) => {
            return !activity ? msg.req : null;
        };
        const validateDateFrom = (dateFrom) => {
            return !dateFrom && type && type !== "recurring" ? registerUserInfo[lang].dateFrom + msg.required : null;
        };
        const validateDateTo = (dateTo) => {
            return !dateTo && type && type !== "recurring" ? registerUserInfo[lang].dateTo + msg.required : null;
        };
        const validateDaysFrom = (daysFrom) => {
            return !daysFrom && type === "recurring" ? registerUserInfo[lang].daysFrom + msg.required : null;
        };
        const validateDaysTo = (daysTo) => {
            return !daysTo && type === "recurring" ? registerUserInfo[lang].daysTo + msg.required : null;
        };
        const validateHoursFrom = (hoursFrom) => {
            return !hoursFrom && type && type !== "long" ? msg.req : null;
        };
        const validateHoursTo = (hoursTo) => {
            return !hoursTo && type && type !== "long" ? msg.req : null;
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
                if (totalDays < 0 || dateFrom < today) return msg.time;
            }
            if (type === "recurring") {
                const daysFrom = Number(values.daysFrom) || 7;
                const daysTo = Number(values.daysTo) || 7;
                if (daysFrom > daysTo) return msg.time;
            }
            if (type && type !== "long") {
                const hoursFrom = Number(values.hoursFrom);
                const hoursTo = Number(values.hoursTo);
                if (hoursTo - hoursFrom <= 0) return msg.time;
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
                        message: registerUserInfo[lang].successTitle,
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
        for (const r in region[lang]) {
            if (region[lang].hasOwnProperty(r) && r !== "all") {
                regionOptions.push({
                    label: region[lang][r],
                    value: r,
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
        const { targetregion } = this.props.match.params;
        const { type } = this.state;
        const { regionOptions, dayOptions, hourOptions } = this.populateInputs(lang);
        const text = registerUserInfo[lang];

        let { info } = this.props;
        info = info.id ? this.formatDefaultValues(info) : {};
        info = Object.assign(info, {
            region: targetregion,
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
                                <h3><b>{text.title}</b></h3>
                                <div className="form-group radio-group">
                                    <StyledRadioGroup field="activity" id="activity">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <label htmlFor="activity">{text.activity}</label>
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
                                                <label htmlFor="kitchenOwner">{text.purpose}</label>
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
                                <TextInput id="phone" placeholder={register[lang].phone} icon="fa-phone-square" />
                                <h3>{text.datesTitle}</h3>
                                <div className="form-group radio-group">
                                    <StyledRadioGroup field="type" id="type" onChange={this.onTypeChange} >
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="once" id="once" label={orderType[lang].once} className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="recurring" id="recurring" label={orderType[lang].recurring} className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="long" id="long" label={orderType[lang].long} className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                {type ? type !== "recurring" ?
                                    <div className="inline">
                                        <div className="form-group form-group-date" >
                                            <label htmlFor="dateFrom">{text.dateFrom}</label>
                                            <StyledText type="date" field="dateFrom" id="dateFrom" className="form-control" />
                                        </div>
                                        <div className="form-group form-group-date" >
                                            <label htmlFor="dateTo">{text.dateTo}</label>
                                            <StyledText type="date" field="dateTo" id="dateTo" className="form-control" />
                                        </div>
                                    </div>
                                    :
                                    <div className="inline">
                                        <div className="form-group form-group-date">
                                            <label htmlFor="daysFrom">{text.daysFrom}</label>
                                            <StyledSelect field="daysFrom" id="daysFrom" options={dayOptions} />
                                        </div>
                                        <div className="form-group form-group-date">
                                            <label htmlFor="daysTo">{text.daysTo}</label>
                                            <StyledSelect field="daysTo" id="daysTo" options={dayOptions} />
                                        </div>
                                    </div>
                                    : null}
                                {type && type !== "long" ?
                                    <div className="inline">
                                        <Select id="hoursFrom" label={text.from} options={hourOptions} />
                                        <Select id="hoursTo" label={text.to} options={hourOptions} />
                                        <div className="form-group" />
                                        <div className="form-group" />
                                    </div>
                                    : null}
                                <TextInput id="time" type="hidden" />
                                <TextInput id="comments" type="textarea" placeholder={text.comments}
                                    label={(<div>{text.commentsHeader0}<br />{text.commentsHeader1}</div>)} />
                                <div className="form-group" >
                                    <button id="submit" type="submit" className="btn btn-orange">{text.submit}</button>
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