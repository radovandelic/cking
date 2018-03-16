import { Component } from 'react';
import '../styles/footer.css';

class AdminRedirect extends Component {
    componentWillMount = () => {
        if (!!window.chrome && !!window.chrome.webstore) {
            //window.location = window.self.location;
        } else {
            window.location.reload(true);
        }
    }

    render = () => {
        return null;
    }
}

export default AdminRedirect;