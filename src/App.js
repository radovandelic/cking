import React, { Component } from 'react';
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
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <img src="https://www.co-oking.be/wp-content/uploads/2016/03/atelier_four_gallerie.jpg" alt="" />
              {/* <Register /> */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
