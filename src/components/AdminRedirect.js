import { Component } from "react";
import "../styles/footer.css";

class AdminRedirect extends Component {
    componentWillMount = () => {
        if (!!window.chrome && !!window.chrome.webstore) { // check if browser is chrome

            // clear cache before reloading content in order to get to admin page on chrome
            const id = `sw-precache-v3-sw-precache-webpack-plugin-https://${window.location.hostname}/`;
            caches.open(id)
                .then(cache => cache.keys()
                    .then(keys => {
                        for (const key of keys) {
                            if (key.url.indexOf("index.html") !== -1) {
                                cache.delete(key)
                                    .then(window.location.reload(true));
                            }
                        }
                    }));
        } else {
            // just reload page without cache to get to admin page on non-chrome browsers
            window.location.reload(true);
        }
    }

    render = () => {
        return null;
    }
}

export default AdminRedirect;