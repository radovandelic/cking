import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import base64 from "base-64";
import { updateLang } from "../actions";
import { header } from "../data/translations";
import "../styles/header.css";
import logo from "../logo.jpg";

class Header extends Component {

    toggleMenu = () => {
        const collapse = document.getElementsByClassName("navbar-collapse")[0];
        collapse.classList.toggle("collapse");
        collapse.classList.toggle("in");
    }

    updateLang(user, lang) {
        let url = "http://0.0.0.0:9000/api/users/" + user.id;
        user.lang = lang;
        fetch(url, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                window.localStorage.setItem("user", base64.encode(JSON.stringify(data)));
            })
            .catch(err => {
                console.log(err);
            });
    }

    langChange = (e) => {
        const { updateLang, user } = this.props;
        const lang = e.target.value;
        if (user.id) this.updateLang(user, lang);
        updateLang(lang);
    }

    render = () => {
        const { kitchen, user, lang } = this.props;
        return (
            <header>
                <Helmet>
                    <html lang={lang} />
                </Helmet>
                <nav className="navbar navbar-default navbar-fixed-top" id="home">
                    <div className="container-fluid">
                        <div className="navbar-header navbar-logo">
                            <button onClick={this.toggleMenu} type="button" className="navbar-toggle collapsed"
                                data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <Link to="/">
                                <img className="logo" src={logo} alt="logo" />
                            </Link>
                        </div>

                        <div className="collapse navbar-collapse">
                            {!user.id ?
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <Link to="/login" onClick={this.toggleMenu} >
                                            <button className="btn navbar-btn nav-link nav-link-white">
                                                {header[lang].login}
                                            </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/register" onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-white">
                                                {header[lang].register}
                                            </button>
                                        </Link>
                                    </li>
                                    <li id="faq-navbar-link">
                                        <a href="#FAQ" onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                FAQ
                                            </button>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#contact" onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                {header[lang].contact}
                                            </button>
                                        </a>
                                    </li>
                                    <li id="lang">
                                        <div className="select lang">
                                            <select key={lang} defaultValue={lang} onChange={this.langChange}>
                                                <option value="fr" >FR</option>
                                                <option value="nl" >NL</option>
                                                <option value="en" >EN</option>
                                            </select>
                                            <div className="select_arrow">
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/register" onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-orange">
                                                {header[lang].createListing}
                                            </button>
                                        </Link>
                                    </li>
                                </ul>
                                :
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <Link to="/dashboard" onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                {header[lang].dashboard}
                                            </button>
                                        </Link>
                                    </li>
                                    <li id="faq-navbar-link">
                                        <a href="#FAQ" onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                FAQ
                                            </button>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#contact" onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                {header[lang].contact}
                                            </button>
                                        </a>
                                    </li>
                                    <li id="lang">
                                        <div className="select lang">
                                            <select defaultValue={lang} onChange={this.langChange}>
                                                <option value="fr" >FR</option>
                                                <option value="nl" >NL</option>
                                                <option value="en" >EN</option>
                                            </select>
                                            <div className="select_arrow">
                                            </div>
                                        </div>
                                    </li>
                                    <li>{user.kitchenOwner
                                        ?
                                        <Link to={kitchen.id ? "/updatekitchen" : "/registerkitchen"}
                                            onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-orange">
                                                {kitchen.id ? header[lang].editListing : header[lang].createListing}
                                            </button>
                                        </Link>
                                        :
                                        <Link to="/"
                                            onClick={this.toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-orange">
                                                {header[lang].browseKitchens}
                                            </button>
                                        </Link>
                                    }
                                    </li>
                                </ul>
                            }
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

const mapStateToProps = state => {
    return {
        kitchen: state.kitchen,
        user: state.user,
        lang: state.user.lang
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateLang: (lang) => {
            dispatch(updateLang(lang));
        }
    };
};

Header = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

export default Header;