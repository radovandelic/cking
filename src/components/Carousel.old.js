import React from "react";

export default () => {
    return (
        <ul className="slides">
            <input type="radio" name="radio-btn" id="img-1" checked />
            <li className="slide-container">
                <div className="slide">
                    <img src="/img/bf_1825.jpg" alt="co-oking SPRL" />
                </div>
                <div className="nav">
                    <label for="img-4" className="prev">&#x2039;</label>
                    <label for="img-2" className="next">&#x203a;</label>
                </div>
            </li>

            <input type="radio" name="radio-btn" id="img-2" />
            <li className="slide-container">
                <div className="slide">
                    <img src="/img/web-slider-atelier.jpg" alt="co-oking SPRL" />
                </div>
                <div className="nav">
                    <label for="img-1" className="prev">&#x2039;</label>
                    <label for="img-3" className="next">&#x203a;</label>
                </div>
            </li>

            <input type="radio" name="radio-btn" id="img-3" />
            <li className="slide-container">
                <div className="slide">
                    <img src="/img/slide2-locaux-co-oking-exterieur.jpg" alt="co-oking SPRL" />
                </div>
                <div className="nav">
                    <label for="img-2" className="prev">&#x2039;</label>
                    <label for="img-4" className="next">&#x203a;</label>
                </div>
            </li>


            <input type="radio" name="radio-btn" id="img-4" />
            <li className="slide-container">
                <div className="slide">
                    <img src="/img/atelier_general-1.jpg" alt="co-oking SPRL" />
                </div>
                <div className="nav">
                    <label for="img-3" className="prev">&#x2039;</label>
                    <label for="img-1" className="next">&#x203a;</label>
                </div>
            </li>

            <li className="nav-dots">
                <label for="img-1" className="nav-dot" id="img-dot-1"></label>
                <label for="img-2" className="nav-dot" id="img-dot-2"></label>
                <label for="img-3" className="nav-dot" id="img-dot-3"></label>
                <label for="img-4" className="nav-dot" id="img-dot-4"></label>
            </li>
        </ul>
    );
};