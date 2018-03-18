import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, NotFound, AdminRedirect, Footer } from './components';
import {
  Register, Login, Home, Dashboard, RegisterKitchen, ImageUpload, Browse, Kitchen,
  UpdateKitchen, ContactForm, Terms, UpdateAccount, LoadUserInfo
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
              {/* <Route exact path="/registerextra" component={RegisterExtra} /> */}
              <Route exact path="/uploadimage" component={ImageUpload} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/browse" component={Browse} />
              <Route exact path="/updatekitchen" component={UpdateKitchen} />
              <Route exact path="/updateaccount" component={UpdateAccount} />
              <Route exact path="/terms" component={Terms} />
              <Route exact path="/listings/kitchens/:id" component={Kitchen} />
              <Route exact path="/admin" component={AdminRedirect} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />{/* 
          <div id="contact" className="popup">
            <a className="close" href="#home">&times;</a>
            <div className="input-div">
              <br />
              <p><b>Des questions sur notre fonctionnement ? </b></p>
            </div>
            <ContactForm />
          </div>
          <a href="#home" class="close-popup">&nbsp;</a> */}
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
