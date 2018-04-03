import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateUser } from "../actions";
import { header, popup } from "../data/text";
import "../styles/dashboard.css";

class VerifyAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: 0,
            status: false,
        };
    }

    componentWillMount = () => {
        const { id, token } = this.props.match.params;
        const { user, updateUser } = this.props;
        const url = "http://0.0.0.0:9000/api/users/verify/" + id + "/" + token;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        fetch(url, {
            method: "GET",
            headers: headers,
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        this.setState({ message: "verified", status: 200 });
                        user.verified = true;
                        updateUser(user);
                        break;
                    case 404:
                        this.setState({ message: "notFound", status: 404 });
                        break;
                    default:
                        this.setState({ message: "errorMessageConnect", status: 500 });
                        break;
                }
                return response.json();
            })/* 
            .then(data => {
                this.setState({ status: 200, message: "verified" });
            }) */
            .catch(err => {
                if (this.state.status === 404);
                this.setState({ message: this.state.status === 404 ? "notFound" : "errorMessageConnect" });
            });
    }

    render = () => {
        const { message, status } = this.state;
        const { user, lang } = this.props;
        return (
            <div className="dashoard-container">
                <h4>{popup[lang][message]}</h4>
                {status === 200 ?
                    user.id ?
                        <Link to="/dashboard">
                            <button className="btn btn-orange">{header[lang].dashboard}</button>
                        </Link>
                        :
                        <Link to="/login">
                            <button className="btn btn-orange">{header[lang].login}</button>
                        </Link>
                    : null
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    lang: state.user.lang,
});

const mapDispatchToProps = dispatch => ({
    updateUser: (user) => dispatch(updateUser(user)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VerifyAccount);