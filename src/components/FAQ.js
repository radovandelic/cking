import React from "react";
import { connect } from "react-redux";
import { faq } from "../data/text";
import "../styles/faq.css";

const togglePanel = (e) => {
    e.target.nextSibling.classList.toggle("active");
};

const FAQ = (props) => {
    const { lang } = props;
    const Accordion = [];
    for (const el of faq[lang]) {
        Accordion.push(
            <div key={el.Q}>
                <button className="accordion" onClick={togglePanel}>
                    {el.Q}
                </button>
                <div className="panel">
                    <h5><div align="left">
                        {el.A}
                    </div></h5>
                </div>
            </div>
        );
    }
    return (
        <div className="FAQ" key={lang}>
            {Accordion}
        </div>
    );
};

const mapStateToProps = state => ({
    lang: state.user.lang,
});

export default connect(
    mapStateToProps,
    null
)(FAQ);