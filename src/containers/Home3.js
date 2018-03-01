import React from 'react';
import '../styles/bg2.css';

export default () => {
    return (<div className="home-container2">
        <div className="orange-div">
            Le reseau professionels de l'HORECA
    </div>
        <div className="home-caption">
            Trouver des cuisines professionelles <br />
            Trouver du personnel <br />
            Trouver des experts <br />
        </div>
        <div id="mainselection" >
            <select>
                <option>Ville/Region</option>
                <option>Bruxelles</option>
                <option>Brabant</option>
                <option>Antwerpen</option>
            </select>
        </div> &nbsp;&nbsp;&nbsp;

            <div id="mainselection" >
            <select>
                <option>Espace de cuisine</option>
                <option>Kitchen</option>
                <option>Cook</option>
                <option>Consultant</option>
            </select>
        </div>
    </div>
    );
}