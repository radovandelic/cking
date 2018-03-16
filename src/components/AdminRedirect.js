import { Component } from 'react';
import '../styles/footer.css';

class AdminRedirect extends Component {
    componentWillMount = () => {
        window.location.reload(true);
    }

    render = () => {
        return null;
    }
}

export default AdminRedirect;