import React from "react";
import { StyledRadioGroup, StyledRadio } from "react-form";

export default (props) => {
    const { id, options, label, labels, onChange } = props;
    return (
        <div className="form-group radio-group" id={id}>
            <label htmlFor={id}>{label}</label>
            <StyledRadioGroup field={id} id={id} onChange={onChange} >
                {group => (
                    <ul className="radio-grid" >
                        {options.map(option => (
                            <li key={option}> <StyledRadio group={group} value={option} id={option} label={labels[option]} className="d-inline-block" /> </li>
                        ))}
                    </ul>
                )}
            </StyledRadioGroup>
        </div>
    );
};
