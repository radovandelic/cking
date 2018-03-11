import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Header, Footer } from './components';
import {
  Register, Login, Home, Dashboard, RegisterKitchen, ImageUpload, Browse, Kitchen,
  UpdateKitchen, ContactForm
} from './containers';
import './styles/App.css';

class App extends Component {

  render = () => {
    return (
      <Router>
        <div className="App text-center">
          <Header />
          <main>
            <div id="header_spacing"></div>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/registerkitchen" component={RegisterKitchen} />
            <Route exact path="/uploadimage" component={ImageUpload} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/browse" component={Browse} />
            <Route exact path="/kitchenid" component={Kitchen} />
            <Route exact path="/updatekitchen/:id" component={UpdateKitchen} />
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
