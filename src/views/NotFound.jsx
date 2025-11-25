import React from "react";
import NotFoundVisual from "../components/NotFound/NotFoundVisual";
import NotFoundText from "../components/NotFound/NotFoundText";

export default function NotFound() {
    return (
        <section className="not-found">
            <NotFoundVisual />
            <NotFoundText />
        </section>
    );
}
