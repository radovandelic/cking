import React from "react";
import { withGoogleMap, GoogleMap, Circle } from "react-google-maps";

const circleOptions = {
    fillColor: "#ff6114",
    fillOpacity: 0.5,
    strokeColor: "#ff6114",
    strokeOpacity: 0.5,
    radius: 1500,
    center: {
        lat: 50.850,
        lng: 4.351,
    },
};

export default withGoogleMap((props) => {
    circleOptions.center = props.marker;
    return (
        <GoogleMap
            defaultZoom={12}
            defaultCenter={props.marker || { lat: 50.850, lng: 4.351 }} >
            <Circle options={circleOptions} />
        </GoogleMap>
    );
});