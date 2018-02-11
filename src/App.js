import React, { Component } from 'react';
//import logo from './logo.svg';
import './styles/flatter-child/style.css';
import './styles/res/css/language-selector.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './containers/Register';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="header_spacing" className="hidden-xs"></div>
        <Header />
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>*/}
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <Register />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
