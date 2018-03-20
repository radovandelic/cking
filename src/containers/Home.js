import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ContactForm } from '.'
import { FAQ } from '../components'
import '../styles/home.css';


export default class extends Component {

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
        return (<div className="home-container">
            <div className="home-block-1" id="top">
                <div className="home-title">
                    <h1>Louez une cuisine près de chez vous, facilement</h1>
                </div>
                <div className="home-description">
                    <h4>CookWork vous permet de louer un atelier pro</h4>
                    <h4>aux normes AFSCA en toute flexibilité</h4>
                </div>
                <div className="select">
                    <select defaultValue="all" onChange={this.selectOnChange} id="region">
                        <option value="all" disabled>Ville/Region</option>
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
                        <option value="all" disabled>Espace de cuisine</option>
                        <option value="all">Tout</option>
                        <option value="kitchen">Cuisine laboratoire</option>
                        <option value="sharedkitchen">Cuisine laboratoire partagée</option>
                        <option value="restaurant">Cuisine de restaurant</option>
                        <option value="collectiverestaurant">Cuisine de restaurant collective</option>
                    </select>
                    <div className="select_arrow">
                    </div>
                </div>
                <Link to={`/browse/${this.state.region}/${this.state.type}`}>
                    <button className="btn btn-orange" id="go">Trouver une cuisine</button>
                </Link>
            </div>
            <div className="home-block-2">
                <div className="home-title">
                    <h1>Choisissez votre atelier</h1>
                </div>
                <div className="home-description">
                    <h4>Vous lancez votre projet alimentaire ?</h4>
                    <h4>Une grosse production en vue ? </h4>
                    <br />
                    <h4>Les cuisines CookWork sont équipées pour la production professionnelle</h4>
                </div>
            </div>
            <div className="home-block-3">
                <div className="home-title">
                    <h1>Comment ça fonctionne?</h1>
                    <h6>Etapes par étapes, nous vous guidons pour assurer votre booking</h6>
                </div>
                <div className="home-inline" >
                    <div className="inline-element" >
                        <h1>01</h1>
                        <p><b>Vous remplissez le formulaire</b></p>
                        <p>Avec vos besoins spécifiques</p>
                    </div>
                    <div className="inline-element">
                        <h1>02</h1>
                        <p><b>Vous réservez</b></p>
                        <p>Une cuisine seléctionnée pour vous</p>
                    </div>
                    <div className="inline-element">
                        <h1>03</h1>
                        <p><b>Vous cuisinez</b></p>
                        <p>Vous réalisez votre production dans des conditions optimales</p>
                    </div>
                </div>
            </div>
            <div className="home-block-4" id="FAQ">
                <div className="home-title"> <h1>FAQ</h1></div>
                <h4>Des questions? Vos premières réponses </h4>
                <FAQ />
            </div>
            <div className="home-block-4" id="contact">
                <div className="home-contact">
                    <h1>Des questions ?</h1>
                    <ContactForm />
                </div>
            </div>
        </div>
        );
    }
}