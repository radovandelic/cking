import { Component } from 'react';
import '../styles/footer.css';

class Admin extends Component {
    componentWillMount = () => {
        setTimeout(() => {
            window.location.reload(true);
        }, 100);
    }

    render = () => {
        return null;
    }
}

export default Admin;