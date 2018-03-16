import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Popup, Map } from '../components';
import '../styles/browse.css';

var errorTitle = "Error"
var errorMessageConnect = "There has been an error connecting to the server. Please try again later."

class Browse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kitchens: [],
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect
            }
        };
    }
    componentDidMount = () => {
        let url = 'http://0.0.0.0:9000/api/kitchens';

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ kitchens: data.rows });
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" })
            });

        //load carousel scripts here so we don't slow down the rest of the app
        if (!document.getElementById("jssor")) { //check if scripts are already loaded
            let script = document.createElement("script");
            script.id = "jssor";
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jssor-slider/27.1.0/jssor.slider.min.js";
            script.async = true;
            //script.integrity = "sha256-I6cF3fG3SkCsFWISv0FVllzVmZmDDLuiUcw60+n1Q3I=";
            //script.crossorigin = "anonymous";
            document.body.appendChild(script);

            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "/static/js/carousel.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }

    render = () => {
        let { kitchens } = this.state;
        let Listings = [];
        for (const kitchen of kitchens) {
            Listings.push(
                <div key={kitchen.id} className="thumb-container">
                    <div className="circle-container">
                        <div className="circle"></div>
                    </div>
                    <div className="flex-thumb-container">
                        <div className="listing-info">
                            <Link to={`/listings/kitchens/${kitchen.id}`}>
                                <img src={kitchen.images.length !== 0 ? kitchen.images[0].thumbnail : "/static/media/no-image.jpg"}
                                    alt={kitchen.name} className="img-thumbnail" />
                            </Link>
                        </div>
                        <div className="listing-info">
                            <Link to={`/listings/kitchens/${kitchen.id}`}>
                                <h4>{kitchen.name}</h4>
                                <h6>{kitchen.type}</h6>
                                <h4>{kitchen.size} m<sup>2</sup> </h4>
                                <h3 className="price-m">€{kitchen.price} / h</h3>
                            </Link>
                            <Link className="address" to={`/listings/kitchens/${kitchen.id}`}>{kitchen.address}</Link>
                        </div>
                        <div className="listing-info price">
                            <h3>€{kitchen.price} / h</h3>
                        </div>
                    </div>
                </div>
            )
        }
        return (<div className="browse-container">
            <div className="listings">
                {Listings}
            </div>{/* 
            <div className="map-container">
                <Map
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div> */}
            <Popup overlay={this.state.overlay} title={errorTitle}
                message={this.state.popup.message} btn="ok" close={this.closePopup} />
        </div>
        )
    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

export default Browse;