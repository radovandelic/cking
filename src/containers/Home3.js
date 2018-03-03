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
        <div className="select left">
            <select>
                <option>--Ville/Region--</option>
                <option>Bruxelles</option>
                <option>Brabant</option>
                <option>Antwerpen</option>
            </select>
            <div className="select_arrow">
            </div>
        </div>
        <div className="select">
            <select>
                <option>--Espace de cuisine--</option>
                <option>Kitchen</option>
                <option>Cook</option>
                <option>Consultant</option>
            </select>
            <div className="select_arrow">
            </div>
        </div>
        <a>
            <button className="btn btn-warning" id="go">Go</button>
        </a>
    </div>
    );
}