import React, { useEffect, useMemo, useState } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarNavSection from "./SidebarNavSection";
import checkForUpdates from "../../functions/getVersion";

export default function Sidebar({ isOpen, onClose }) {
    const [packageVersion, setPackageVersion] = useState('Latest');

    useEffect(() => {
        async function fetchVersion() {
            const version = await checkForUpdates();
            setPackageVersion(version);
        }
        fetchVersion();
    }, [])

    const navigationData = useMemo(
        () => [
            {
                title: "GETTING STARTED",
                items: [
                    { path: "/instalation", label: "Installation" },
                    { path: "/quick-start", label: "Quick Start" },
                ],
            },
            {
                title: "VALIDATORS (Functions)",
                items: [
                    {
                        path: "/email",
                        label: "Email Validation",
                    },
                    {
                        path: "/password",
                        label: "Password Validation",
                    },
                    {
                        path: '/password-strength',
                        label: "Password Strength",
                    },
                    {
                        path: '/password-match',
                        label: "Password Match Validation",
                    },
                    {
                        path: '/username',
                        label: "Username Validation",
                    },
                    {
                        path: '/otp',
                        label: "OTP Validation",
                    },
                    {
                        path: '/session-token',
                        label: "Session Token Validation",
                    },
                    {
                        path: '/xss',
                        label: "XSS Validation",
                    }
                ],
            },
            {
                title: "UTILITIES",
                items: [
                    {
                        path: '/password-generator',
                        label: "Password Generator",
                    },
                    {
                        path: '/otp-generator',
                        label: "OTP Generator",
                    },
                    {
                        path: '/session-token-generator',
                        label: "Session Token Generator",
                    }
                ]
            },
            {
                title: "FAQ",
                items: [
                    { path: "/faq-general", label: "General Questions" },
                    // { path: "/faq-contribute", label: "Contributing" },
                    { path: "/faq-changelog", label: "Changelog" },
                ],
            },
        ],
        []
    );

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <SidebarHeader
                logo="validauth"
                version={packageVersion}
            />
            <nav className="sidebar-nav">
                {navigationData.map((section, index) => (
                    <SidebarNavSection
                        key={index}
                        title={section.title}
                        items={section.items}
                        onItemClick={onClose}
                    />
                ))}
            </nav>
        </aside>
    );
}

Sidebar.defaultProps = {
    isOpen: false,
    onClose: () => {}
}
