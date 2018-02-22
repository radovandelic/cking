import React from 'react';
import { Tabs } from '../components';

export default () => {
    return (<div className="form-container">
        <Tabs />
        <img src="/img/atelier_four_gallerie.jpg" alt="atelier four gallerie"
            className="img-rounded img-responsive center-block img-home" />
        <div className="caption">
            <h1>Rent a kitchen and hire extra resources</h1>
        </div>
    </div>
    );
}