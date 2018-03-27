import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Popup } from '../components';
import '../styles/browse.css';
import { type } from '../data/translations';
import { GMAPS_KEY } from '../config';

var errorTitle = "Error"
var errorMessageConnect = "There has been an error connecting to the server. Please try again later."

class Browse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kitchens: [],
            count: -1,
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect
            }
        };
    }

    componentWillMount = () => {
        let { region, type } = this.props.match.params;
        region = region !== "all" ? "region=" + region : ""
        type = type !== "all" ? "type=" + type : ""
        const url = `http://0.0.0.0:9000/api/kitchens?${region}&${type}`;


        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ kitchens: data.rows, count: data.count });
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" })
            });

        //load map and carousel scripts here so we don't slow down the rest of the app
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

            script = document.createElement("script");
            script.id = "gmaps";
            script.type = "text/javascript";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`;
            script.async = true;
            document.body.appendChild(script);
        }
    }

    render = () => {
        let { kitchens, count } = this.state;
        let { user } = this.props
        let Listings = [];
        for (const kitchen of kitchens) {
            kitchen.type = type['fr'][kitchen.type]
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
                                <h6>{kitchen.type}</h6>
                                <h4>{kitchen.size} m<sup>2</sup> </h4>
                                <h3 className="price-m">€{kitchen.price} / h</h3>
                            </Link>
                            <Link className="address" to={user.id ? `/listings/kitchens/${kitchen.id}` : `/register`}>
                                {kitchen.region}
                            </Link>
                        </div>
                        <div className="listing-info price">
                            <Link className="price" to={user.id ? `/listings/kitchens/${kitchen.id}` : `/register`}>
                                {user.id ? <h3>€{kitchen.price} / h</h3> : <button className="btn btn-orange">More Info</button>}
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }
        return (<div className="browse-container">
            <div className="listings">
                {count === 0
                    ?
                    <div className="dashoard-container">
                        <h4>No results found.</h4>
                    </div>
                    :
                    Listings
                }
            </div>
            <Popup overlay={this.state.overlay} title={errorTitle}
                message={this.state.popup.message} btn="ok" close={this.closePopup} />
        </div>
        )
    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

Browse = connect(
    mapStateToProps,
    null
)(Browse)

export default Browse;