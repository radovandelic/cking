import { Component } from "react";
import { connect } from "react-redux";
import base64 from "base-64";
import { updateKitchen, updateUser, updateInfo } from "../actions";

class LoadUserInfo extends Component {
    // This component loads user data from localstorage and then attempts to update it from the api.
    // It is loaded whenever the app is initially loaded.

    fetchUser(user) {
        const { updateUser } = this.props;
        const url = "http://0.0.0.0:9000/api/users/" + user.id + "?access_token=" + user.access_token;
        fetch(url, {
            method: "GET",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(data => updateUser({ ...data, access_token: user.access_token }))
            .catch(err => console.warn(err));
    }

    fetchKitchen(id, token) {
        const { updateKitchen } = this.props;
        const url = "http://0.0.0.0:9000/api/kitchens/" + id + "?access_token=" + token;
        fetch(url, {
            method: "GET",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
        })
            .then(response => {
                if (response.status === 404) updateKitchen({});
                return response.json();
            })
            .then(data => updateKitchen(data))
            .catch(err => console.warn(err));
    }

    componentWillMount = () => {
        if (!this.props.user.id) {
            let user = localStorage.getItem("user");
            if (user) {
                const { updateUser } = this.props;
                user = JSON.parse(base64.decode(user));
                user.access_token = localStorage.getItem("access_token");
                const lang = navigator.language.substring(0, 2);
                user.lang = user.lang || (["fr", "nl", "en"].indexOf(lang) !== -1 ? lang : "en");

                updateUser(user); // redundant, but makes the initial load faster.
                this.fetchUser(user);

                if (!this.props.kitchen.id) {
                    let mykitchen = localStorage.getItem("mykitchen");
                    if (mykitchen) {
                        const { updateKitchen } = this.props;
                        const access_token = localStorage.getItem("access_token");
                        mykitchen = JSON.parse(base64.decode(mykitchen));

                        updateKitchen(mykitchen); // redundant, but makes the initial load faster.
                        this.fetchKitchen(mykitchen.id, access_token);
                    }
                }

                if (!this.props.info.id) {
                    let info = localStorage.getItem("info");
                    if (info) {
                        const { updateInfo } = this.props;
                        info = JSON.parse(base64.decode(info));
                        updateInfo(info);
                    }
                }
            }
        }
    }

    render = () => {
        return null;
    }
}

const mapStateToProps = state => ({
    user: state.user,
    kitchen: state.kitchen,
    info: state.info,
});

const mapDispatchToProps = dispatch => ({
    updateUser: (user) => dispatch(updateUser(user)),
    updateKitchen: (kitchen) => dispatch(updateKitchen(kitchen)),
    updateInfo: (info) => dispatch(updateInfo(info)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadUserInfo);