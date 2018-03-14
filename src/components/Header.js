import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../logo.jpg';
import '../styles/header.css';
import '../index.css';

const toggleMenu = () => {
    const collapse = document.getElementsByClassName('navbar-collapse')[0]
    collapse.classList.toggle('collapse');
    collapse.classList.toggle('in');
}

class Header extends Component {

    render = () => {
        return (
            <header>
                <nav className="navbar navbar-default navbar-fixed-top" id="home">
                    <div className="container-fluid">
                        <div className="navbar-header navbar-logo">
                            <button onClick={toggleMenu} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
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
                            {!this.props.user.id ?
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <Link to="/login" onClick={toggleMenu} >
                                            <button className="btn navbar-btn nav-link nav-link-white">
                                                Login
                                        </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/register" onClick={toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-white">
                                                Register
                                        </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#contact" onClick={toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                Contact
                                        </button>
                                        </a>
                                    </li>
                                    <li>
                                        <Link to="/register" onClick={toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-orange">
                                                Create listing
                                        </button>
                                        </Link>
                                    </li>
                                </ul>
                                :
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <Link to="/dashboard" onClick={toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                Dashboard
                                        </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#contact" onClick={toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                Contact
                                        </button>
                                        </a>
                                    </li>
                                    <li>
                                        <Link to={this.props.kitchen.id ? `/updatekitchen` : "/registerkitchen"}
                                            onClick={toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-orange">
                                                {this.props.kitchen.id ? "Edit listing" : "Create listing"}
                                            </button>
                                        </Link>
                                    </li>
                                </ul>
                            }
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        kitchen: state.kitchen
    }
}

Header = connect(
    mapStateToProps,
    null
)(Header)

export default Header;