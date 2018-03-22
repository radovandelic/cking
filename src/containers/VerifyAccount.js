import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import '../styles/dashboard.css';

class VerifyAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: 0,
            status: false
        };
    }

    componentDidMount = () => {
        const { id, token } = this.props.match.params;
        let url = 'http://0.0.0.0:9000/api/users/verify/' + id + "/" + token;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        this.setState({ message: "Account verified", status: 200 })
                        break;
                    case 404:
                        this.setState({ message: "User or verification token not found.", status: 404 })
                        break;
                    default:
                        this.setState({ message: "Error connecting to the server. Please try again later.", status: 500 })
                        break;
                }
                return response.json()
            })
            .then(data => {
                this.setState({ status: 200, message: "Account verified" })
            })
            .catch(err => {
                this.setState({ message: "Error connecting to the server. Please try again later.", status: 500 })
            })
    }

    render = () => {
        const { message, status } = this.state
        const { user } = this.props
        return (
            <div className="dashoard-container">
                <h4>{message}</h4>
                {status === 200 ?
                    user.id ?
                        <Link to="/dashboard">
                            <button className="btn btn-orange">Dashboard</button>
                        </Link>
                        :
                        <Link to="/login">
                            <button className="btn btn-orange">Login</button>
                        </Link>
                    : null
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

VerifyAccount = connect(
    mapStateToProps,
    null
)(VerifyAccount)

export default VerifyAccount;