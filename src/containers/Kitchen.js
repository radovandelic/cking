import React from 'react';
import { Carousel } from '../components'
import '../styles/kitchen.css';

export default () => {
    return (<div className="listing-container">
        <Carousel />
        <div>
            <h2>
                Co-oking SPRL
            </h2>
            Rue Henri-Joseph Genesse 34, boîte 9 <br />
            1070 Bruxelles <br />
            <button className="btn btn-orange" >Contact</button>
        </div>
    </div>
    )
}