import React from 'react';
import logo from '../logo_co-ocking.png';
import { Link } from 'react-router-dom';

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
                            <div className="top-bar-right text-right">
                                <div className="top-share-items top_share hidden-xs">
                                    <ul className="share-items">
                                        <li>
                                            <a href="https://www.facebook.com/CookingBxl" className="facebook"
                                                target="_blank" rel="noopener noreferrer" title="Facebook">
                                                <i className="fa fa-facebook fa-lg"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://twitter.com/CookingBxl" className="twitter"
                                                target="_blank" rel="noopener noreferrer" title="Twitter">
                                                <i className="fa fa-twitter fa-lg"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.linkedin.com/company/co-oking" className="linkedin"
                                                target="_blank" rel="noopener noreferrer" title="Linkedin"><i className="fa fa-linkedin fa-lg"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {!user ?
                                    <div className="topbar-item login-item newsl-item">
                                        <Link to="/login" title="Login"><i className="fa fa-envelope"></i><span>Login</span></Link>
                                    </div>
                                    :
                                    <div className="topbar-item login-item user-icons">
                                        <Link to="/dashboard"><i className="fa fa-user-plus add-user"></i><span className="login-item-txt">Dashboard</span></Link>
                                    </div>
                                }
                                {!user ?
                                    <div className="topbar-item login-item user-icons">
                                        <Link to="/register"><i className="fa fa-user-plus add-user"></i><span className="login-item-txt">Register</span></Link>
                                    </div>
                                    :
                                    null
                                }
                                <div className="woocommerce-shcart woocommerce topbar-item hidden-sm hidden-xs">
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
                                </div>
                                <div id="lang_sel_list" className="lang_sel_list_horizontal">
                                    <ul>
                                        <li className="icl-en"><a href="en/index.html" className="lang_sel_other">EN</a></li>
                                        {/* <li className="icl-nl"><a href="nl/index.html" className="lang_sel_other">NL</a></li>
                                        <li className="icl-fr"><a href="index.html" className="lang_sel_sel">FR</a></li> */}
                                    </ul>
                                </div>

                                <div className="header-search topbar-item" title="Search"><a className="search-icon"><i className="fa lo-search"></i></a><div className="search-form">
                                    <form method="get" id="searchform" action="index.html">
                                        <div className="input-group">
                                            <input type="text" className="form-control" name="s" placeholder="Votre recherche">
                                                {/* <span className="input-group-btn">
                                                    <button className="btn btn-default" type="submit">Go!</button>
                                                </span> */}
                                            </input>
                                        </div>
                                    </form>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header >


    )
}