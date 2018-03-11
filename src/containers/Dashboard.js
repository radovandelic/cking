import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateKitchen, updateUser } from '../actions';

let Dashboard = (props) => {

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('mykitchen');
        localStorage.removeItem('mykitchen_id');
        props.updateKitchen({});
        props.updateUser({});
        window.location.href = "/";
    }

    const { user, kitchen } = props;

    return (!user.id ? <Redirect to="/login" />
        :
        <div className="dashoard-container">
            <h4>Welcome back {user.firstName || user.name} </h4>
            <img src={user.picture} alt={user.name} />
            <br /><br /><Link to={kitchen.id ? `/updatekitchen` : "/registerkitchen"}>
                <button id="dashboard-btn" type="submit" className="mb-4 btn btn-orange">{kitchen.id ? "Edit your kitchen listing" : "Create kitchen listing"}</button>
            </Link>
            <br /><br />
            <button id="dashboard-btn" type="submit" className="mb-4 btn btn-orange">Register as cook</button>
            <br /><br />
            <button id="dashboard-btn" type="submit" className="mb-4 btn btn-orange">Register as consultant</button>
            <br /><br />
            {/* <button id="dashboard-btn" type="submit" className="mb-4 btn btn-orange">Account Settings</button>
            <br /><br /> */}
            <button id="logout" type="submit" onClick={logout} className="mb-4 btn btn-danger">Logout</button>

        </div>
    )
}

const mapStateToProps = state => {
    return {
        kitchen: state.kitchen,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateKitchen: (kitchen) => {
            dispatch(updateKitchen(kitchen));
        },
        updateUser: (user) => {
            dispatch(updateUser(user));
        }
    }
}

Dashboard = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard)

export default Dashboard;