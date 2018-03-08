import React from 'react';
import { Link, Redirect } from 'react-router-dom';


const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('mykitchen');
    window.location.href = "/";
}
export default () => {
    var user = JSON.parse(localStorage.getItem("user"));
    var mykitchen = localStorage.getItem("mykitchen");

    return (!user ? <Redirect to="/login" />
        :
        <div className="home-container">
            <div className="dashoard-container">
                <h4>Welcome back {user.firstName || user.name} </h4>
                <img src={user.picture} alt={user.name} />
                <br /><br /><Link to={mykitchen ? `/updatekitchen/${mykitchen}` : "/registerkitchen"}>
                    <button id="dashboard-btn" type="submit" className="mb-4 btn btn-orange">{mykitchen ? "Edit your kitchen listing" : "Create kitchen listing"}</button>
                </Link>
                <br /><br />
                <button id="dashboard-btn" type="submit" className="mb-4 btn btn-orange">Register as cook</button>
                <br /><br />
                <button id="dashboard-btn" type="submit" className="mb-4 btn btn-orange">Register as consultant</button>
                <br /><br />
                <button id="dashboard-btn" type="submit" className="mb-4 btn btn-orange">Account Settings</button>
                <br /><br />
                <button id="logout" type="submit" onClick={logout} className="mb-4 btn btn-danger">Logout</button>

            </div>
        </div>
    )
}