import React from "react";
import { connect } from "react-redux";
import { popup } from "../data/text";
import "../styles/popup.css";

const Popup = (props) => {
    const { lang } = props;
    return (

        <div id="popup" className={props.overlay}>
            <div className="popup">
                <h2>{props.title}</h2>
                <a className="close" onClick={props.close} >&times;</a>
                <br />
                <div className="content">
                    {props.message}
                </div>
                {props.btn === "ok" ?
                    <button className="btn btn-orange" onClick={props.close}>{popup[lang].ok}</button>
                    : props.btn === "yesno" ?
                        <div className="inline" >
                            <button value={props.yes} className="btn btn-orange inline" onClick={props.close}>{popup[lang].yes}</button>
                            <button value={props.no} className="btn btn-orange inline" onClick={props.close}>{popup[lang].no}</button>
                        </div>
                        : null
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    lang: state.user.lang,
});

export default connect(
    mapStateToProps,
    null
)(Popup);