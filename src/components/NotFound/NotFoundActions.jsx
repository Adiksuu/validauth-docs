import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundActions() {
    return (
        <div className="not-found-actions">
            <Link to="/" className="not-found-button">
                <span><FontAwesomeIcon icon={faChevronLeft} /></span>
                Back to Home
            </Link>
            <a href="mailto:codeadiksuu@gmail.com" className="not-found-secondary-link">
                Contact support
            </a>
        </div>
    );
}

