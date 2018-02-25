import React from 'react';
import { Tabs } from '../components';
import '../styles/bg2.css';

export default () => {
    return (<div className="home-container">
        <Tabs />
        <div className="dashoard-container">
            <h4>Welcome to CookWork </h4>
            <br />
            <p>
                CookWork matches professional kitchen owners
    with cooks and foodies looking for a cooking space to rent. CookWork provides additional services such as finding extra personnel and HORECA consultants
            </p>
        </div>
    </div>
    );
}