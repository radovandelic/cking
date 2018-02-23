import React from 'react';

export default () => {
    return (
        <ul className="nav nav-tabs nav-justified">
            <li className="nav-item">
                <a className="nav-link" data-toggle="tab" role="tab">Find a kitchen</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-toggle="tab" role="tab">Find a chef</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-toggle="tab" role="tab">Find a consultant</a>
            </li>
        </ul>
    )
}