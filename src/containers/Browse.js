import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/browse.css';

export default () => {


    return (<div className="home-container">
        <Link to="/kitchenid">
            <div className="thumb-listing-container">
                <img src="/img/no-image.jpg" alt="img not found" className="img-thumbnail" />
                <div className="listing-info">
                    <h4>Kitchen name</h4>
                    <h6>Cuisine laboratoire</h6>
                    <Link to="/kitchenid">Rue Victor Hugo</Link>
                </div>
            </div>
        </Link>


        <Link to="/kitchenid">
            <div className="thumb-listing-container">
                <img src="/img/no-image.jpg" alt="img not found" className="img-thumbnail" />
                <div className="listing-info">
                    <h4>Kitchen name</h4>
                    <h6>Cuisine laboratoire</h6>
                    <Link to="/kitchenid">Rue Victor Hugo</Link>
                </div>
            </div>
        </Link>
        <Link to="/kitchenid">
            <div className="thumb-listing-container">
                <img src="/img/no-image.jpg" alt="img not found" className="img-thumbnail" />
                <div className="listing-info">
                    <h4>Kitchen name</h4>
                    <h6>Cuisine laboratoire</h6>
                    <Link to="/kitchenid">Rue Victor Hugo</Link>
                </div>
            </div>
        </Link>
        <Link to="/kitchenid">
            <div className="thumb-listing-container">
                <img src="/img/no-image.jpg" alt="img not found" className="img-thumbnail" />
                <div className="listing-info">
                    <h4>Kitchen name</h4>
                    <h6>Cuisine laboratoire</h6>
                    <Link to="/kitchenid">Rue Victor Hugo</Link>
                </div>
            </div>
        </Link>
        <Link to="/kitchenid">
            <div className="thumb-listing-container">
                <img src="/img/no-image.jpg" alt="img not found" className="img-thumbnail" />
                <div className="listing-info">
                    <h4>Kitchen name</h4>
                    <h6>Cuisine laboratoire</h6>
                    <Link to="/kitchenid">Rue Victor Hugo</Link>
                </div>
            </div>
        </Link>
    </div>
    )
}