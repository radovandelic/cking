import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, FAQ, AdminRedirect, NotFound, Footer } from './components';
import {
  Home, LoadUserInfo, Login, Register, Dashboard, RegisterKitchen, UpdateKitchen, UpdateAccount,
  ImageUpload, Browse, Kitchen, RentKitchen, ContactForm, VerifyAccount, RegisterUserInfo, Terms
} from './containers';
import { home } from './data/translations'
import './styles/App.css';

class App extends Component {
  ScrollToTop = () => {
    if (window.location.href.indexOf("#") === -1) {
      window.scrollTo(0, 0);
    }
    return null;
  }

  render = () => {
    const { id, lang } = this.props
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
                <Route exact path="/listings/kitchens/:id/rent" component={RentKitchen} />
                <Route exact path="/userinfo" component={RegisterUserInfo} />
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
              <h3><b>FAQ</b></h3>
              {lang === 'fr' ? <h4>Des questions? Vos premières réponses </h4> : null}
            </div>
            <FAQ />
          </div>
          <a href="#home" className="faq-overlay">&nbsp;</a>

          <div id="contact" className="contact-form" >
            <a className="close" href="#home">&times;</a>
            <div className="input-div">
              <h3><b>{home[lang].contactTitle}</b></h3>
            </div>
            <ContactForm />
          </div>
          <a href="#home" className="contact-overlay">&nbsp;</a>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    id: state.user.id,
    lang: state.user.lang
  }
}
App = connect(
  mapStateToProps,
  null
)(App)

export default App;
