import React from "react";
import logo from "../logo_co-oking.png";
import { Link } from "react-router-dom";
import "../styles/flatter-child/style.css";

export default () => {
    var user = JSON.parse(localStorage.getItem("user"));
    return (

        <header id="header" className="navbar navbar-inverse navbar-fixed-top " role="banner">

            <div id="top-bar" className="top-bar">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 no-pad-r no-pad-l">
                            <div className="top-bar-left text-left">
                                <Link to="/">
                                    <img className="logo" src={logo} alt="logo" />
                                </Link>
                            </div>
                            {/* <div className="top-share-items top_share hidden-xs">
                                    <ul className="share-items">
                                        <li>
                                            <a href="https://www.linkedin.com/company/co-oking" className="linkedin"
                                                target="_blank" rel="noopener noreferrer" title="Linkedin">Create Listing
                                            </a>
                                        </li>
                                    </ul>
                                </div> */}
                            {!user ?

                                <div className="top-bar-right text-right">
                                    <div className="topbar-item login-item user-icons">
                                        <a href="https://www.co-oking.be/contact/" target="_blank" rel="noopener noreferrer"><i className="fa fa-user-plus add-user"></i><span className="login-item-txt">Contact</span></a>
                                    </div>
                                    <div className="topbar-item login-item newsl-item">
                                        <Link to="/login" title="Login"><i className="fa fa-envelope"></i><span>Login</span></Link>
                                    </div>
                                    <div className="topbar-item login-item user-icons">
                                        <Link to="/register"><i className="fa fa-user-plus add-user"></i><span className="login-item-txt">Register</span></Link>
                                    </div>
                                    <div className="topbar-item create-listing-item">
                                        <Link to="/register"><i className="fa fa-user-plus add-user"></i><span className="create-listing-item-txt">Create listing</span></Link>
                                    </div>
                                    <div id="lang_sel_list" className="lang_sel_list_horizontal">
                                        <ul>
                                            <li className="icl-en"><a className="lang_sel_other">EN</a></li>
                                            {/* <li className="icl-nl"><a href="nl/index.html" className="lang_sel_other">NL</a></li>
                                        <li className="icl-fr"><a href="index.html" className="lang_sel_sel">FR</a></li> */}
                                        </ul>
                                    </div>
                                </div>
                                :
                                <div className="top-bar-right text-right">
                                    <div className="topbar-item login-item user-icons">
                                        <a href="https://www.co-oking.be/contact/" target="_blank" rel="noopener noreferrer"><i className="fa fa-user-plus add-user"></i><span className="login-item-txt">Contact</span></a>
                                    </div>
                                    <div className="topbar-item login-item user-icons">
                                        <Link to="/dashboard"><i className="fa fa-user-plus add-user"></i><span className="login-item-txt">Dashboard</span></Link>
                                    </div>
                                    <div className="topbar-item create-listing-item user-icons">
                                        <Link to="/registerkitchen"><i className="fa fa-user-plus add-user"></i><span className="create-listing-item-txt">Create listing</span></Link>
                                    </div>
                                    <div id="lang_sel_list" className="lang_sel_list_horizontal">
                                        <ul>
                                            <li className="icl-en"><a className="lang_sel_other">EN</a></li>
                                            {/* <li className="icl-nl"><a href="nl/index.html" className="lang_sel_other">NL</a></li>
                                        <li className="icl-fr"><a href="index.html" className="lang_sel_sel">FR</a></li> */}
                                        </ul>
                                    </div>
                                </div>
                            }
                            {/* <div className="woocommerce-shcart woocommerce topbar-item hidden-sm hidden-xs">
                                    <div className="shcart-display">
                                        <i className="fa fa-shopping-cart"></i>
                                        <span className="total-cart">0</span>
                                    </div>
                                    <div className="shcart-content">
                                        <div className="widget_shopping_cart_content">
                                            <ul className="cart_list product_list_widget ">
                                                <li className="empty">Votre panier est vide.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div> */}

                            {/* <div className="header-search topbar-item hidden-xs" title="Search"><a className="search-icon"><i className="fa lo-search"></i></a>
                                    <div className="search-form">
                                        <form method="get" id="searchform" action="index.html">
                                            <div className="input-group">
                                                <input type="text" className="form-control" name="s" placeholder="Votre recherche">
                                                    <span className="input-group-btn">
                                                        <button className="btn btn-default" type="submit">Go!</button>
                                                    </span>
                                                </input>
                                            </div>
                                        </form>
                                    </div>
                                </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </header >


    );
};