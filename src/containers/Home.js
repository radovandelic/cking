import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ContactForm } from ".";
import { FAQ } from "../components";
import { home, region, type } from "../data/text";
import "../styles/home.css";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region: "all",
            type: "all",
        };
    }

    selectOnChange = (e) => {
        const selectedIndex = e.target.selectedIndex;
        const value = e.target.children[selectedIndex].value;
        this.setState({ [e.target.id]: value });
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
                        <option value="all">{region[lang].all}</option>
                        <option value="Antwerpen">{region[lang].Antwerpen}</option>
                        <option value="Brabant">{region[lang].Brabant}</option>
                        <option value="Bruxelles">{region[lang].Bruxelles}</option>
                        <option value="EastFlanders">{region[lang].EastFlanders}</option>
                        <option value="Hainaut">{region[lang].Hainaut}</option>
                        <option value="Liege">{region[lang].Liege}</option>
                        <option value="Limburg">{region[lang].Limburg}</option>
                        <option value="Luxembourg">{region[lang].Luxembourg}</option>
                        <option value="Namur">{region[lang].Namur}</option>
                        <option value="WestFlanders">{region[lang].WestFlanders}</option>
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
                {lang === "fr" ? <h4>{home[lang].faqTitle} </h4> : null}
                <FAQ />
                <br />
                <h4>{home[lang].faqFooter} </h4>
            </div>
            <div className="home-block-4" id="contact">
                <div className="home-contact">
                    <h1>{home[lang].contactTitle}</h1>
                    <ContactForm key={lang} />
                </div>
            </div>
        </div>
        );
    }
}

const mapStateToProps = state => ({
    lang: state.user.lang,
});

export default connect(
    mapStateToProps,
    null
)(Home);