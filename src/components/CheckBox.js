import React from "react";
import { StyledCheckbox } from "react-form";

export default (props) => {
    const { options, label, labels } = props;
    return (
        <div className="form-group">
            <label htmlFor="equipment">{label}</label>
            <ul className="checkbox-grid">
                {options.map(e => (
                    <li key={e}>  <StyledCheckbox field={e} id={e} label={labels[e]} className="d-inline-block" /></li>
                ))}
            </ul>
        </div>
    );
};
