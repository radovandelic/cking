import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, FAQ, AdminRedirect, NotFound, Footer } from './components';
import {
  Register, Login, Home, Dashboard, RegisterKitchen, ImageUpload, Browse, Kitchen,
  UpdateKitchen, ContactForm, Terms, UpdateAccount, VerifyAccount, RentKitchen, LoadUserInfo
} from './containers';
import './styles/App.css';

const ScrollToTop = () => {
  if (window.location.href.indexOf("#") === -1) {
    window.scrollTo(0, 0);
  }
  return null;
}

class App extends Component {
  render = () => {
    return (
      <Router>
        <div className="App text-center">
          <LoadUserInfo />
          <Header />
          <main>
            <div id="header_spacing"></div>
            <Route component={ScrollToTop} />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/registerkitchen" component={RegisterKitchen} />
              <Route exact path="/uploadimage" component={ImageUpload} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/browse/:region/:type" component={Browse} />
              <Route exact path="/updatekitchen" component={UpdateKitchen} />
              <Route exact path="/updateaccount" component={UpdateAccount} />
              <Route exact path="/terms" component={Terms} />
              <Route exact path="/listings/kitchens/:id" component={Kitchen} />
              <Route exact path="/listings/kitchens/:id/rent" component={RentKitchen} />
              <Route exact path="/verifyaccount/:id/:token" component={VerifyAccount} />
              <Route exact path="/admin" component={AdminRedirect} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />

          <div id="FAQ" className="faq-container" >
            <a className="close" href="#home">&times;</a>
            <div className="input-div">
              <h3><b>FAQ</b></h3>
              <h4>Des questions? Vos premières réponses </h4>
            </div>
            <FAQ />
          </div>
          <a href="#home" className="faq-overlay">&nbsp;</a>

          <div id="contact" className="contact-form" >
            <a className="close" href="#home">&times;</a>
            <div className="input-div">
              <h3><b>Des questions ? </b></h3>
            </div>
            <ContactForm />
          </div>
          <a href="#home" className="contact-overlay">&nbsp;</a>
        </div>
      </Router>
    );
  }
}

export default App;
