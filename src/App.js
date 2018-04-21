import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header, FAQ, AdminRedirect, NotFound, Footer } from "./components";
import {
    Home, LoadUserInfo, Login, Register, Dashboard, RegisterKitchen, UpdateKitchen, UpdateAccount,
    ImageUpload, Browse, Kitchen, PlaceOrder, ContactForm, VerifyAccount, RegisterUserInfo, Terms,
} from "./containers";
import { home } from "./data/text";
import "./styles/bootstrap.css";
import "./styles/font-awesome.min.css";
import "./styles/App.css";

class App extends Component {
    ScrollToTop = () => {
        if (window.location.href.indexOf("#") === -1) {
            window.scrollTo(0, 0);
        }
        return null;
    }

    componentDidMount = () => {
        if (window.location.hostname !== "localhost") {
            let script = document.createElement("script");
            script.src = "/static/js/analytics.js";
            document.body.appendChild(script);

            script = document.createElement("script");
            script.src = "https://www.googletagmanager.com/gtag/js?id=UA-117632949-1";
            script.setAttribute("async", "true");
            document.body.appendChild(script);
        }
    }

    render = () => {
        const { id, lang } = this.props;
        return (
            <Router>
                <div className="App text-center">
                    <Route component={this.ScrollToTop} />
                    <LoadUserInfo />
                    <Header />
                    <main>
                        <div id="header_spacing"></div>
                        {id ?
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/dashboard" component={Dashboard} />
                                <Route exact path="/login" component={Login} />
                                <Route exact path="/register" component={Register} />
                                <Route exact path="/registerkitchen" component={RegisterKitchen} />
                                <Route exact path="/updatekitchen" component={UpdateKitchen} />
                                <Route exact path="/uploadimage" component={ImageUpload} />
                                <Route exact path="/updateaccount" component={UpdateAccount} />
                                <Route exact path="/browse/:region/:type" component={Browse} />
                                <Route exact path="/listings/kitchens/:id" component={Kitchen} />
                                <Route exact path="/listings/kitchens/:id/order" component={PlaceOrder} />
                                <Route exact path="/userinfo/:targetregion" component={RegisterUserInfo} />
                                <Route exact path="/verifyaccount/:id/:token" component={VerifyAccount} />
                                <Route exact path="/terms" component={Terms} />
                                <Route exact path="/admin" component={AdminRedirect} />
                                <Route component={NotFound} />
                            </Switch>
                            :
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/login" component={Login} />
                                <Route exact path="/register" component={Register} />
                                <Route exact path="/browse/:region/:type" component={Browse} />
                                <Route exact path="/verifyaccount/:id/:token" component={VerifyAccount} />
                                <Route exact path="/terms" component={Terms} />
                                <Route exact path="/admin" component={AdminRedirect} />
                                <Route component={NotFound} />
                            </Switch>
                        }
                    </main>
                    <Footer />

                    <div id="FAQ" className="faq-container" >
                        <a className="close" href="#home">&times;</a>
                        <div className="input-div">
                            <button className="accordion accordion-title">
                                <b>FAQ</b>
                            </button>
                        </div>
                        <FAQ />
                    </div>
                    <a href="#home" className="faq-overlay">&nbsp;</a>

                    <div id="contact" className="contact-form" >
                        <a className="close" href="#home">&times;</a>
                        <div className="input-div">
                            <h3><b>{home[lang].contactTitle}</b></h3>
                        </div>
                        <ContactForm key={lang} />
                    </div>
                    <a href="#home" className="contact-overlay">&nbsp;</a>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    id: state.user.id,
    lang: state.user.lang,
});

App = connect(
    mapStateToProps,
    null
)(App);

export default App;
