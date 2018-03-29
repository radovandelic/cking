import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { ContactForm } from '.'
import { FAQ } from '../components'
import { home, type } from '../data/translations'
import '../styles/home.css';


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region: "all",
            type: "all"
        };
    }

    selectOnChange = (e) => {
        let selectedIndex = e.target.selectedIndex;
        let value = e.target.children[selectedIndex].value
        this.setState({ [e.target.id]: value })
    }

    render = () => {
        const { lang } = this.props;
        return (<div className="home-container">
            <div className="home-block-1" id="top">
                <div className="home-title">
                    <h1>{home[lang].title1}</h1>
                </div>
                {home[lang].description1}
                <div className="select">
                    <select defaultValue="all" onChange={this.selectOnChange} id="region">
                        <option value="all" disabled>{home[lang].selectRegionDefault}</option>
                        <option value="all">Tout</option>
                        <option value="Antwerpen">Antwerpen</option>
                        <option value="Brabant">Brabant</option>
                        <option value="Bruxelles">Bruxelles</option>
                        <option value="EastFlanders">East Flanders</option>
                        <option value="Hainaut">Hainaut</option>
                        <option value="Liege">Liege</option>
                        <option value="Limburg">Limburg</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Namur">Namur</option>
                        <option value="WestFlanders">West Flanders</option>
                    </select>
                    <div className="select_arrow">
                    </div>
                </div>
                <div className="select right">
                    <select defaultValue="all" onChange={this.selectOnChange} id="type" >
                        <option value="all" disabled>{home[lang].selectTypeDefault}</option>
                        <option value="all">{type[lang].all}</option>
                        <option value="kitchen">{type[lang].kitchen}</option>
                        <option value="sharedkitchen">{type[lang].sharedkitchen}</option>
                        <option value="restaurant">{type[lang].restaurant}</option>
                        <option value="collectiverestaurant">{type[lang].collectiverestaurant}</option>
                    </select>
                    <div className="select_arrow">
                    </div>
                </div>
                <Link to={`/browse/${this.state.region}/${this.state.type}`}>
                    <button className="btn btn-orange" id="go">{home[lang].findKitchenButton}</button>
                </Link>
            </div>
            <div className="home-block-2">
                <div className="home-title">
                    <h1>{home[lang].title2}</h1>
                </div>
                {home[lang].description2}
            </div>
            <div className="home-block-3">
                {home[lang].title3}
                {home[lang].description3}
            </div>
            <div className="home-block-4" id="FAQ">
                <div className="home-title"> <h1>FAQ</h1></div>
                <h4>{home[lang].faqTitle} </h4>
                <FAQ />
                <br />
                <h4>{home[lang].faqFooter} </h4>
            </div>
            <div className="home-block-4" id="contact">
                <div className="home-contact">
                    <h1>{home[lang].contactTitle}</h1>
                    <ContactForm />
                </div>
            </div>
        </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        lang: state.user.lang
    }
}
Home = connect(
    mapStateToProps,
    null
)(Home)

export default Home;