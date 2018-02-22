import React, { Component } from 'react';
import './styles/flatter-child/style.css';
import './styles/res/css/language-selector.css';
import './styles/App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Register, Login, Home, Dashboard } from './containers';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div id="header_spacing" className="hidden-xs"></div>
          <Header />
          <div className="container" style={{ height: '100%' }}>
            <div className="row" style={{ height: '100%' }}>
              <div className="col-md-12 text-center" style={{ height: '100%' }}>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/dashboard" component={Dashboard} />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
