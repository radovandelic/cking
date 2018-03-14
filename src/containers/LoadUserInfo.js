import { Component } from 'react';
import { connect } from 'react-redux';
import base64 from 'base-64';
import { updateKitchen, updateUser } from '../actions';

class LoadUserInfo extends Component {
    componentWillMount = () => {
        if (!this.props.user.id) {
            let { updateUser } = this.props;
            let user = localStorage.getItem("user");
            if (user) {
                user = JSON.parse(base64.decode(user))
                user.access_token = localStorage.getItem("access_token");
                updateUser(user);
            }
        }

        if (!this.props.kitchen.id) {
            let { updateKitchen } = this.props;
            let mykitchen = localStorage.getItem("mykitchen");
            if (mykitchen) updateKitchen(JSON.parse(base64.decode(mykitchen)));
        }
    }

    render = () => {
        return null;
    }
}


const mapStateToProps = state => {
    return {
        user: state.user,
        kitchen: state.kitchen
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

LoadUserInfo = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadUserInfo)

export default LoadUserInfo;