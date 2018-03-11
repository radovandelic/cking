import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Popup } from '../components';
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
        let url = 'https://cookwork.be/api/kitchens';

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
    }

    render = () => {
        let { kitchens } = this.state;
        let listings = [];
        for (const kitchen of kitchens) {
            listings.push(
                <Link to={`/listings/kitchens/${kitchen.id}`}>
                    <div className="thumb-listing-container">
                        <img src={kitchen.images.length !== 0 ? kitchen.images[0].thumbnail : "/img/no-image.jpg"} alt={kitchen.name} className="img-thumbnail" />
                        <div className="listing-info">
                            <h4>{kitchen.name}</h4>
                            <h6>{kitchen.type}</h6>
                            <h4>{kitchen.size} m<sup>2</sup> </h4>
                            <Link to={`/listings/kitchens/${kitchen.id}`}>{kitchen.address}</Link>
                        </div>
                        <div className="listing-info">
                            <h3>€{kitchen.price} / h</h3>
                        </div>
                    </div>
                </Link>
            )
        }
        return (<div className="home-container">
            {listings}
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