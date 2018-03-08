import React, { Component } from 'react';
//import './styles/flatter-child/style.css';
//import './styles/res/css/language-selector.css';
import './styles/App.css';
import { Header, Footer } from './components';
import {
  Register, Login, Home2, Dashboard, RegisterKitchen, ImageUpload, Browse, Kitchen,
  UpdateKitchen
} from './containers';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <main>
            <div id="header_spacing"></div>
            <div className="container">
              <div className="col-md-12 text-center">
                <Route exact path="/" component={Home2} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/registerkitchen" component={RegisterKitchen} />
                <Route exact path="/uploadimage" component={ImageUpload} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/browse" component={Browse} />
                <Route exact path="/kitchenid" component={Kitchen} />
                {/* <Route exact path="/updatekitchen/:id" component={UpdateKitchen} /> */}
              </div>
            </div>
          </main>
          {/* <Footer /> */}
        </div>
      </Router>
    );
  }
}

export default App;
