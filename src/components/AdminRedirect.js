import { Component } from 'react';
import '../styles/footer.css';

class AdminRedirect extends Component {
    componentWillMount = () => {
        if (!!window.chrome && !!window.chrome.webstore) {
            caches.open('sw-precache-v3-sw-precache-webpack-plugin-' + window.location.href)
                .then(cache => cache.keys()
                    .then(keys => {
                        for (let key of keys) {
                            cache.delete(key)
                        }
                    }));
        } else {
            window.location.reload(true);
        }
    }

    render = () => {
        return null;
    }
}

export default AdminRedirect;