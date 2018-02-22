import React from 'react';
import { Tabs } from '../components';
//import '../styles/bg2.css';

export default () => {
    return (<div className="home-container">
        <Tabs />
        <div className="dashoard-container">
            <h4>Welcome to cookwork.be </h4>
            <br /><br />
            <button id="dashboard-btn" type="submit" className="mb-4 btn btn-warning">Browse kitchen listings</button>
            <br /><br />
            <button id="dashboard-btn" type="submit" className="mb-4 btn btn-warning">Find a chef</button>
            <br /><br />
            <button id="dashboard-btn" type="submit" className="mb-4 btn btn-warning">Find a consultant</button>
            <br />
        </div>
    </div>
    );
}