import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, NotFound, Footer } from './components';
import {
  Register, Login, Home, Dashboard, RegisterKitchen, ImageUpload, Browse, Kitchen,
  UpdateKitchen, ContactForm, LoadUserInfo, RegisterExtra, UpdateAccount
} from './containers';
import './styles/App.css';
import backgroundImg from './background.jpg'

const background = "linear-gradient( rgba(0, 0, 0, .8), rgba(0, 0, 0, .6)), url(" + backgroundImg + ") no-repeat center center fixed";

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
        <div className="App text-center" style={{ background: background, backgroundSize: "cover" }} >
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
              <Route exact path="/registerextra" component={RegisterExtra} />
              <Route exact path="/uploadimage" component={ImageUpload} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/browse" component={Browse} />
              <Route exact path="/updatekitchen" component={UpdateKitchen} />
              <Route exact path="/updateaccount" component={UpdateAccount} />
              <Route exact path="/listings/kitchens/:id" component={Kitchen} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
          <div className="contact-overlay" id="contact">
            <div className="contact-form" >
              <a className="close" href="#home">&times;</a>
              <div className="input-div">
                <br />
                <p><b>Des questions sur notre fonctionnement ? </b></p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
