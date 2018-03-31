import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateKitchen, updateUser, updateLang } from "../actions";
import { dashboard, header } from "../data/translations";
import "../styles/dashboard.css";

let Dashboard = (props) => {

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("mykitchen");
        localStorage.removeItem("mykitchen_id");
        const lang = props.lang;
        props.updateKitchen({});
        props.updateUser({});
        props.updateLang(lang);
        window.location.href = "/";
    };

    const { user, kitchen, lang } = props;
    return (
        <div className="dashoard-container">
            <h4>{dashboard[lang].welcomeMsg} {user.firstName || user.name} </h4>
            <div>
                <img src={user.picture} alt={user.name} />
            </div> <br />
            {kitchen.id || user.kitchenOwner ?
                <Link to={kitchen.id ? `/updatekitchen` : "/registerkitchen"}>
                    <button className="mb-4 btn btn-orange dashboard-btn">{kitchen.id ? header[lang].editListing : header[lang].createListing}</button>
                </Link>
                : null
            }
            {kitchen.id ?
                <Link to={kitchen.id ? `/uploadimage` : "/registerkitchen"}>
                    <button className="mb-4 btn btn-orange dashboard-btn">{dashboard[lang].editImages}</button>
                </Link>
                :
                null
            }
            <Link to="/updateaccount">
                <button className="mb-4 btn btn-orange dashboard-btn">{dashboard[lang].accountInfo}</button>
            </Link>
            <button id="logout" type="submit" onClick={logout} className="mb-4 btn btn-danger dashboard-btn">{dashboard[lang].logout}</button>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        kitchen: state.kitchen,
        user: state.user,
        lang: state.user.lang
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateKitchen: (kitchen) => {
            dispatch(updateKitchen(kitchen));
        },
        updateUser: (user) => {
            dispatch(updateUser(user));
        },
        updateLang: (lang) => {
            dispatch(updateLang(lang));
        }
    };
};

Dashboard = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);

export default Dashboard;