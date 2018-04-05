import React from "react";
import { StyledText, StyledTextArea } from "react-form";

export default (props) => {
    const { id, label, placeholder, type, min, max, readOnly, icon } = props;
    return (
        <div className={"form-group" + (icon ? " has-feedback" : type === "date" ? " form-group-date" : "")} >
            {label ? <label htmlFor={id}>{label}</label> : null}

            {type === "textarea" ?
                <StyledTextArea field={id} id={id} placeholder={placeholder} className="form-control" rows="4" />
                :
                <StyledText field={id} id={id} type={type || "text"} className="form-control" placeholder={placeholder} min={min} max={max} readOnly={readOnly} />
            }

            {icon ? <i className={`fa ${icon} form-control-feedback`}></i> : null}
        </div>
    );
};
