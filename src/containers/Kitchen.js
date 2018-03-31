import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import googleGeocoder from "google-geocoder";
import { Popup, Map } from "../components";
import { equipment, weekDays, staff, type } from "../data/translations";
import { GMAPS_KEY, GEOCODE_KEY } from "../config";
import "../styles/kitchen.css";
import "../styles/carousel.css";
import spin from "../spin.svg";

const geocoder = googleGeocoder({ key: GEOCODE_KEY });
var errorTitle = "Error";
var errorMessageConnect = "There has been an error connecting to the server. Please try again later.";

class Kitchen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kitchen: {
                images: []
            },
            gallery: [],
            location: undefined,
            isMapLoaded: false,
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect
            }
        };
    }

    loadMapScript = () => {
        if (!document.getElementById("gmaps")) {
            let script = document.createElement("script");
            script.id = "gmaps";
            script.type = "text/javascript";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`;
            document.body.appendChild(script);
        }
        this.setState({ isMapLoaded: true });
    }

    loadCarouselScripts = () => {
        //load carousel scripts here so we don't slow down the rest of the app
        if (!document.getElementById("jssor")) { //check if scripts are already loaded
            let script = document.createElement("script");
            script.id = "jssor";
            script.src = "/static/js/jssor.slider-27.1.0.min.js";
            //script.integrity = "sha256-I6cF3fG3SkCsFWISv0FVllzVmZmDDLuiUcw60+n1Q3I=";
            //script.crossorigin = "anonymous";
            document.body.appendChild(script);

            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "/static/js/carousel.js";
            document.body.appendChild(script);
        } else {
            window.jssor_1_slider_init();
        }
    }

    componentDidMount = () => {
        const { id } = this.props.match.params;
        let url = "http://0.0.0.0:9000/api/kitchens/" + id;
        let headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        this.loadMapScript();

        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                let gallery = [];
                if (data.images && data.images[0]) {
                    gallery = [];
                    for (let image of data.images) {
                        gallery.push(
                            <div className="carousel-thumb" key={image._id} data-p="170.00">
                                <img alt={data.name} data-u="image" src={image.large} />
                                <img alt={data.name} data-u="thumb" src={image.thumbnail} />
                            </div>
                        );
                    }
                } else {
                    gallery = (
                        <div data-p="170.00">
                            <img alt={data.name} data-u="image" src="/static/media/no-image.jpg" />
                            <img alt={data.name} data-u="thumb" src="/static/media/no-image.jpg" />
                        </div>
                    );
                }

                //get kitchen coordinates
                geocoder.find(`${data.address}, ${data.postalCode}, ${data.region}`, (err, response) => {
                    if (!err && response[0]) {

                        //set kitchen coordinates
                        this.setState({ location: response[0].location });
                    } else {
                        console.log(err || response, data);
                    }
                });


                this.setState({ kitchen: data, gallery }, () => {
                    //load carousel scripts here so we don't slow down the rest of the app
                    this.loadCarouselScripts();
                });
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" });
            });
    }

    render = () => {
        let { kitchen, isMapLoaded, location } = this.state;
        const { lang } = this.props;
        const Equipment = [];
        const Staff = [];

        for (let e in equipment["fr"]) {
            if (kitchen.equipment && kitchen.equipment[e]) {
                Equipment.push(<li key={e}><i className="fa fa-check"></i>&nbsp; {equipment["fr"][e]}</li>);
            }
        }
        if (!Equipment[0]) {
            Equipment.push(<li key="equipment-none"><i className="fa fa-window-close"></i></li>);
        }

        for (let s in kitchen.staff) {
            Staff.push(<li key={s}><i className="fa fa-check"></i>&nbsp; {staff["fr"][s]}</li>);
        }
        if (!Staff[0]) {
            Staff.push(<li key="staff-none"><i className="fa fa-window-close"></i></li>);
        }
        return (
            <div className="listing-container" >
                <div className="flex-listing-container">
                    <div className="carousel" >
                        <div id="jssor_1" style={{ position: "relative", margin: "0 auto", top: "0px", left: "0px", width: "980px", height: "480px", overflow: "hidden", visibility: "hidden" }}>
                            {/* <!-- Loading Screen --> */}
                            <div data-u="loading" className="jssorl-009-spin" style={{ position: "absolute", top: "0px", left: "0px", width: "100%", height: "100%", textAlign: "center", backgroundColor: "rgba(0,0,0,0.7)" }}>
                                <img alt="loading" style={{ marginTop: "-19px", position: "relative", top: "50%", width: "38px", height: "38px" }} src={spin} />
                            </div>
                            <div data-u="slides" style={{ cursor: "default", position: "relative", top: "0px", left: "0px", width: "980px", height: "380px", overflow: "hidden" }}>
                                {this.state.gallery}
                            </div>
                            {/* <!-- Thumbnail Navigator --> */}
                            <div data-u="thumbnavigator" className="jssort101" style={{ position: "absolute", left: "0px", bottom: "0px", width: "980px", height: "100px", backgroundColor: "#000" }} data-autocenter="1" data-scale-bottom="0.75">
                                <div data-u="slides">
                                    <div data-u="prototype" className="p" style={{ width: "190px", height: "90px" }}>
                                        <div data-u="thumbnailtemplate" className="t"></div>
                                        <svg viewBox="0 0 16000 16000" className="cv">
                                            <circle className="a" cx="8000" cy="8000" r="3238.1"></circle>
                                            <line className="a" x1="6190.5" y1="8000" x2="9809.5" y2="8000"></line>
                                            <line className="a" x1="8000" y1="9809.5" x2="8000" y2="6190.5"></line>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Arrow Navigator --> */}
                            <div data-u="arrowleft" className="jssora106" style={{ width: "55px", height: "55px", top: "162px", left: "30px" }} data-scale="0.75">
                                <svg viewBox="0 0 16000 16000" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
                                    <circle className="c" cx="8000" cy="8000" r="6260.9"></circle>
                                    <polyline className="a" points="7930.4,5495.7 5426.1,8000 7930.4,10504.3 "></polyline>
                                    <line className="a" x1="10573.9" y1="8000" x2="5426.1" y2="8000"></line>
                                </svg>
                            </div>
                            <div data-u="arrowright" className="jssora106" style={{ width: "55px", height: "55px", top: "162px", right: "30px" }} data-scale="0.75">
                                <svg viewBox="0 0 16000 16000" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
                                    <circle className="c" cx="8000" cy="8000" r="6260.9"></circle>
                                    <polyline className="a" points="8069.6,5495.7 10573.9,8000 8069.6,10504.3 "></polyline>
                                    <line className="a" x1="5426.1" y1="8000" x2="10573.9" y2="8000"></line>
                                </svg>
                            </div>
                        </div >
                    </div>
                    <div className="description" >
                        <h2>{kitchen.name}</h2>
                        <h4>{kitchen.region}</h4> <br />
                        <h4>{type[lang][kitchen.type]}, {kitchen.size} m<sup>2</sup></h4>
                        <h4>Availability:&nbsp;
                            {kitchen.days ? weekDays[lang][weekDays.map[kitchen.days.daysFrom]]
                                + " - " + weekDays[lang][weekDays.map[kitchen.days.daysTo]] + ", " : ""}
                            {kitchen.hours ? kitchen.hours.hoursFrom + ":00 - " + kitchen.hours.hoursTo + ":00" : "00 - 24"}
                        </h4>
                        <p>{kitchen.description}</p>
                        <Link to={`/listings/kitchens/${kitchen.id}/rent`}>
                            <button className="btn btn-orange">Contact</button>
                        </Link>
                    </div>
                </div>
                <div className="single-listing-information">
                    {/* <h5> {kitchen.hours && kitchen.hours.hoursFrom && kitchen.hours.hoursTo
                        ? `Heures de disponibilité: ${kitchen.hours.hoursFrom} - ${kitchen.hours.hoursTo}` : ""}
                    </h5>
                    <h5>Nombre de personnes pouvant travailler en cuisine: {kitchen.capacity}</h5> */}
                    <h4>Equipements disponibles:</h4>
                    <ul className="checkbox-grid">
                        {Equipment}
                    </ul>
                    <h4>Services disponibles (en option payante pour le locataire):</h4>
                    <ul className="checkbox-grid">
                        {Staff}
                    </ul>

                </div>
                {kitchen.events ?
                    <div className="single-listing-information">
                        <h4 id="events"><i className="fa fa-check"></i> Espace disponible pour évènement</h4>
                        {kitchen.standingCapacity ? <h5>Capacité debout pour évènement: {kitchen.standingCapacity}</h5> : null}
                        {kitchen.sittingCapacity ? <h5>Capacité assis pour évènement: {kitchen.sittingCapacity}</h5> : null}
                    </div>
                    : null
                }
                {
                    isMapLoaded && location ?
                        <div className="map-container" >
                            <Map
                                isMarkerShown={true}
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ height: `100%`, padding: `20px` }} />}
                                mapElement={<div style={{ height: `100%` }} />}
                                marker={location}
                            />
                        </div>
                        : null
                }
                <Popup overlay={this.state.overlay} title={errorTitle}
                    message={this.state.popup.message} btn="ok" close={this.closePopup} />
            </div >
        );
    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

const mapStateToProps = (state) => ({
    lang: state.user.lang
});

Kitchen = connect(
    mapStateToProps,
    null
)(Kitchen);

export default Kitchen;