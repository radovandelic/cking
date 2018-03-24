import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateKitchen, updateUser } from '../actions';
import '../styles/dashboard.css';

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
    return (
        <div className="dashoard-container">
            <h4>Welcome back {user.firstName || user.name} </h4>
            <div>
                <img src={user.picture} alt={user.name} />
            </div> <br />
            {kitchen.id || user.kitchenOwner ?
                <Link to={kitchen.id ? `/updatekitchen` : "/registerkitchen"}>
                    <button className="mb-4 btn btn-orange dashboard-btn">{kitchen.id ? "Edit your kitchen info" : "Create kitchen listing"}</button>
                </Link>
                : null
            }
            {kitchen.id ?
                <Link to={kitchen.id ? `/uploadimage` : "/registerkitchen"}>
                    <button className="mb-4 btn btn-orange dashboard-btn">Upload / Remove kitchen images</button>
                </Link>
                :
                null
            }
            <Link to="/updateaccount">
                <button className="mb-4 btn btn-orange dashboard-btn">Account Information</button>
            </Link>
            <button id="logout" type="submit" onClick={logout} className="mb-4 btn btn-danger dashboard-btn">Logout</button>
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