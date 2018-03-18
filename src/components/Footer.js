import React from 'react';
import '../styles/footer.css';

export default () => {
    return (
        <footer >
            <ul className="list-inline">
                <li>
                    <a target="_blank" rel="noopener noreferrer"
                        href="/terms">Conditions Générales de Vente</a>
                </li>

                <li >
                    <a href="#contact">Contact</a>
                </li>
            </ul>
        </footer>
    )
}