import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form } from "react-form";
import { TextInput, Select, Radio, Popup } from "../components";
import { updateUser, updateInfo } from "../actions";
import { register, registerUserInfo, order, region, weekDays, activity, purpose, popup, errors } from "../data/text";
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
                        message: registerUserInfo[lang].successMessage,
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
                            <form onSubmit={formApi.submitForm} id="form" className="form-container" key={lang}>
                                <h3><b>{text.title}</b></h3>
                                <Radio id="activity" options={activity.map} label={text.activity} labels={activity[lang]} />
                                <Radio id="purpose" options={purpose.map} label={text.purpose} labels={purpose[lang]} />
                                <Select id="region" options={regionOptions} />
                                <TextInput id="phone" placeholder={register[lang].phone} icon="fa-phone-square" />
                                <h3>{text.datesTitle}</h3>
                                <Radio id={"type"} options={["once", "recurring", "long"]} labels={order[lang]} onChange={this.onTypeChange} />
                                {type ? type !== "recurring" ?
                                    <div className="inline">
                                        <TextInput id="dateFrom" label={text.dateFrom} type="date" />
                                        <TextInput id="dateTo" label={text.dateTo} type="date" />
                                    </div>
                                    :
                                    <div className="inline">
                                        <Select id="daysFrom" options={dayOptions} label={text.daysFrom} className="form-group form-group-date" />
                                        <Select id="daysTo" options={dayOptions} label={text.daysTo} className="form-group form-group-date" />
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