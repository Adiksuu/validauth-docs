import React from "react";
import NotFoundActions from "./NotFoundActions.jsx";

export default function NotFoundText() {
    return (
        <div className="not-found-text">
            <p className="not-found-eyebrow">Oops! Something's missing</p>
            <h1>Page Not Found</h1>
            <p>
                Sorry, we couldn't find the page you were looking for. It might
                have been moved, renamed, or it never existed.
            </p>

            <NotFoundActions />
        </div>
    );
}

