import React from 'react';
import '../styles/bg2.css';

export default () => {
    return (<div className="home-container">
        <div className="dashoard-container">
            <h4>Welcome to CookWork </h4>
            <br />
            <p>
                CookWork matches professional kitchen owners
    with cooks and foodies looking for a cooking space to rent. CookWork provides additional services such as finding extra personnel and HORECA consultants
            </p>
            <div id="mainselection" >
                <select>
                    <option>Select Location</option>
                    <option>Bruxelles</option>
                    <option>Brabant</option>
                    <option>Antwerpen</option>
                </select>
            </div> &nbsp;&nbsp;&nbsp;

            <div id="mainselection" >
                <select>
                    <option>Select Type</option>
                    <option>Kitchen</option>
                    <option>Cook</option>
                    <option>Consultant</option>
                </select>
            </div>
        </div>
    </div>
    );
}