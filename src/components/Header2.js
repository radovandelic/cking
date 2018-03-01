import React from 'react';
import logo from '../logo_co-oking.png';
import { Link } from 'react-router-dom';
import '../styles/header.css'

const toggleMenu = () => {
    const collapse = document.getElementsByClassName('navbar-collapse')[0]
    collapse.classList.toggle('collapse');
    collapse.classList.toggle('in');
}

export default () => {
    var user = JSON.parse(localStorage.getItem("user"));
    return (
        <header>
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
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
                        {!user ?
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <Link to="/login">
                                        <button className="btn navbar-btn nav-link nav-link-white">
                                            Login
                                </button>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register">
                                        <button className="btn navbar-btn nav-link nav-link-white">
                                            Register
                                </button>
                                    </Link>
                                </li>
                                <li>
                                    <a href="https://www.co-oking.be/contact/" target="_blank" rel="noopener noreferrer">
                                        <button className="btn navbar-btn nav-link nav-link-grey">
                                            Contact
                                </button>
                                    </a>
                                </li>
                                <li>
                                    <Link to="/register">
                                        <button className="btn navbar-btn nav-link nav-link-orange">
                                            Create listing
                                </button>
                                    </Link>
                                </li>
                            </ul>
                            :
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <Link to="/dashboard">
                                        <button className="btn navbar-btn nav-link nav-link-grey">
                                            Dashboard
                                </button>
                                    </Link>
                                </li>
                                <li>
                                    <a href="https://www.co-oking.be/contact/" target="_blank" rel="noopener noreferrer">
                                        <button className="btn navbar-btn nav-link nav-link-grey">
                                            Contact
                                </button>
                                    </a>
                                </li>
                                <li>
                                    <Link to="/registerkitchen">
                                        <button className="btn navbar-btn nav-link nav-link-orange">
                                            Create listing
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