import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Popup } from "../components";
import "../styles/browse.css";
import { type, popup } from "../data/text";
import { GMAPS_KEY } from "../config";

class Browse extends Component {

    constructor(props) {
        const { lang } = props;
        super(props);
        this.state = {
            kitchens: [],
            count: -1,
            overlay: "overlay off",
            popup: {
                message: popup[lang].errorMessageConnect,
            },
        };
    }

    componentWillMount = () => {
        let { region, type } = this.props.match.params;
        region = region !== "all" ? "&region=" + region : "";
        type = type !== "all" ? "&type=" + type : "";
        const url = `http://0.0.0.0:9000/api/kitchens?verified=true&sort=createdAt${region}${type}`;

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        fetch(url, {
            method: "GET",
            headers: headers,
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ kitchens: data.rows, count: data.count });
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" });
            });

        // load map and carousel scripts here so we don't slow down the rest of the app
        if (!document.getElementById("jssor")) { // check if scripts are already loaded
            let script = document.createElement("script");
            script.id = "jssor";
            script.src = "/static/js/jssor.slider-27.1.0.min.js";
            script.async = true;
            document.body.appendChild(script);

            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "/static/js/carousel.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
        if (!document.getElementById("gmaps")) {
            const script = document.createElement("script");
            script.id = "gmaps";
            script.type = "text/javascript";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`;
            script.async = true;
            document.body.appendChild(script);
        }
    }

    render = () => {
        const { kitchens, count } = this.state;
        const { user, lang } = this.props;
        const { region } = this.props.match.params;
        const Listings = [];
        const exVAT = lang === "fr" ? "HTVA" : lang === "nl" ? "exc. BTW" : "excl. VAT";
        for (const kitchen of kitchens) {
            Listings.push(
                <div key={kitchen.id} className="thumb-container">
                    <div className="circle-container">
                        <div className="circle"></div>
                    </div>
                    <div className="flex-thumb-container">
                        <div className="listing-info">
                            <Link to={user.id ? `/listings/kitchens/${kitchen.id}` : `/register`}>
                                <img src={kitchen.images.length !== 0 ? kitchen.images[0].thumbnail : "/static/media/no-image.jpg"}
                                    alt={kitchen.name} className="img-thumbnail" />
                            </Link>
                        </div>
                        <div className="listing-info">
                            <Link to={user.id ? `/listings/kitchens/${kitchen.id}` : `/register`}>
                                <h4>{kitchen.name}</h4>
                                <h6>{type[lang][kitchen.type]}</h6>
                                <h4>{kitchen.size} m<sup>2</sup> </h4>
                                {user.id ? <h3 className="price-m">€{+(kitchen.price * 1.2).toFixed(2)} / h</h3> : null}
                            </Link>
                            <Link className="address" to={user.id ? `/listings/kitchens/${kitchen.id}` : `/register`}>
                                {kitchen.region}
                            </Link>
                        </div>
                        <div className="listing-info price">
                            <Link className="price" to={user.id ? `/listings/kitchens/${kitchen.id}` : `/register`}>
                                {user.id ? <h3>€{+(kitchen.price * 1.2).toFixed(2)} / h <br /> ({exVAT})</h3> : <button className="btn btn-orange">More Info</button>}
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
        return (<div className="browse-container">
            <div className="listings">
                {count === 0
                    ?
                    user.id ?
                        <Redirect to={"/userinfo/" + region} />
                        :
                        <Redirect to="/register" />
                    :
                    Listings
                }
            </div>
            <Popup overlay={this.state.overlay} title={popup[lang].errorTitle}
                message={this.state.popup.message} btn="ok" close={this.closePopup} />
        </div>
        );
    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

const mapStateToProps = state => ({
    user: state.user,
    lang: state.user.lang,
});

export default connect(
    mapStateToProps,
    null
)(Browse);