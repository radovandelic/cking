import { Component } from 'react';
import '../styles/footer.css';

class AdminRedirect extends Component {
    componentWillMount = () => {
        if (!!window.chrome && !!window.chrome.webstore) {
            Cache.delete()
        }
        window.location.reload(true);
    }

    render = () => {
        return null;
    }
}

export default AdminRedirect;