import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

// Navigation structure matching Sidebar
const navigationData = [
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
            { path: "/email", label: "Email Validation" },
            { path: "/password", label: "Password Validation" },
            { path: '/password-strength', label: "Password Strength" },
            { path: '/username', label: "Username Validation" }
        ],
    },
    {
        title: "FAQ",
        items: [
            { path: "/faq-general", label: "General Questions" },
            { path: "/faq-changelog", label: "Changelog" },
        ],
    },
]

export default function NextDocument({ currentPath }) {
    const nextDocument = useMemo(() => {
        // Flatten all navigation items
        const allItems = navigationData.flatMap(section => section.items)
        
        // Normalize current path - ensure it starts with /
        const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
        
        // Find current index by matching path
        const currentIndex = allItems.findIndex(item => {
            // Match with or without leading slash
            return item.path === normalizedPath || item.path === currentPath
        })
        
        // Return next item if exists
        if (currentIndex >= 0 && currentIndex < allItems.length - 1) {
            return allItems[currentIndex + 1]
        }
        
        return null
    }, [currentPath])

    if (!nextDocument) {
        return null
    }

    return (
        <div className="next-document">
            <div className="next-document-label">Next</div>
            <Link to={`/docs${nextDocument.path}`} className="next-document-link">
                {nextDocument.label}
                <FontAwesomeIcon icon={faChevronRight} />
            </Link>
        </div>
    )
}

