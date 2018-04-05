import React from "react";
import { StyledSelect, StyledText } from "react-form";

export default (props) => {
    const { id, label, options, time, className } = props;
    return (
        !time ?
            <div className={className || "form-group"} >
                {label ? <label htmlFor={id}>{label}</label> : null}
                <StyledSelect field={id} id={id}
                    options={options} />
            </div>
            : <div>
                <label htmlFor={id}>{label}</label>
                <div className={"form-group form-group-" + id} >
                    <StyledSelect field={id + "From"} id={id + "From"} options={options} />
                    &nbsp;&nbsp;-&nbsp;&nbsp;
                    <StyledSelect field={id + "To"} id={id + "To"} options={options} />
                </div>
                <div className="hiddn" id={id + "msg"}>
                    <StyledText type="hidden" field={id + "msg"} />
                </div>
            </div>
    );
};