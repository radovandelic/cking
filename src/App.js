import React, { Component } from 'react';
import './styles/flatter-child/style.css';
import './styles/res/css/language-selector.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './containers/Register';
import Login from './containers/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = () => {
  return (<div><img style={{
    maxHeight: '82vh',
    maxWidth: '95vw',
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)"
  }} src="/img/atelier_four_gallerie.jpg" alt="" className="img-rounded img-responsive center-block" />
    <div className="caption">
      <h1>Rent a kitchen and hire extra resources</h1>
    </div>
  </div>
  );
}
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
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                </Switch>

                {/* <Register /> */}
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
