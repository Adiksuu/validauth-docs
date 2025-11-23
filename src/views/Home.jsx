import React from "react";
import HomeHero from "../components/Home/HomeHero";
import HomeFeatures from "../components/Home/HomeFeatures";
import { faStar } from "@fortawesome/free-regular-svg-icons";

export default function Home() {
    const heroData = {
        title: "ValidAuth",
        subtitle: "Lightweight, powerful authentication validators for JavaScript applications",
        primaryAction: {
            label: "Github repository",
            href: "https://github.com/Adiksuu/validauth",
        },
        secondaryAction: {
            label: "NPM package",
            href: "https://www.npmjs.com/package/validauth",
        },
    };

    const features = [
        {
            icon: faStar,
            title: "Latest version",
            description:
                "Read about the latest version of ValidAuth and its new features",
            link: {
                label: "Learn more",
                href: "https://github.com/Adiksuu/validauth/releases/latest",
            },
        },
        {
            icon: faStar,
            title: "Changelog",
            description:
                "Review the complete list of changes made in each version of ValidAuth",
            link: {
                label: "Learn more",
                href: "/docs/faq-changelog",
            },
        },
    ];

    return (
        <div className="home-page">
            <HomeHero {...heroData} />
            <HomeFeatures features={features} />
        </div>
    );
}
