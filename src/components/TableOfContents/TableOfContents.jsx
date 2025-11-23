import React, { useMemo, useState, useEffect } from "react";

export default function TableOfContents({ content }) {
    const [activeId, setActiveId] = useState("");

    // Use useMemo to compute headings from content (derived state)
    const headings = useMemo(() => {
        // Extract h2 headings from markdown content
        const h2Regex = /^##\s+(.+)$/gm;
        const matches = [];
        let match;

        while ((match = h2Regex.exec(content)) !== null) {
            const text = match[1].trim();
            // Create a slug from the heading text
            const id = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim();

            matches.push({ id, text });
        }

        return matches;
    }, [content]);

    useEffect(() => {
        if (headings.length === 0) return;

        // Update active heading based on scroll position
        const handleScroll = () => {
            const h2Elements = document.querySelectorAll(
                ".markdown-content h2[id]"
            );

            if (h2Elements.length === 0) return;

            let current = "";
            const scrollOffset = 150; // Offset from top of viewport
            const viewportTop = window.scrollY || window.pageYOffset;

            // Check from bottom to top to find the last heading that's above the offset
            for (let i = h2Elements.length - 1; i >= 0; i--) {
                const element = h2Elements[i];
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + viewportTop;

                // If this heading is above or at the scroll offset, it's the active one
                if (elementTop <= viewportTop + scrollOffset) {
                    current = element.id;
                    break; // Stop at the first (last in DOM order) heading that meets criteria
                }
            }

            // If we're at the very top and no heading is selected, select the first one
            if (!current && viewportTop < 100 && h2Elements.length > 0) {
                current = h2Elements[0].id;
            }

            // If we're near the bottom and no heading is selected, select the last one
            if (!current) {
                const scrollHeight = document.documentElement.scrollHeight;
                const scrollTop = viewportTop + window.innerHeight;
                if (scrollTop >= scrollHeight - 100 && h2Elements.length > 0) {
                    current = h2Elements[h2Elements.length - 1].id;
                }
            }

            // If still no current and we have headings, select the first visible one
            if (!current && h2Elements.length > 0) {
                for (let i = 0; i < h2Elements.length; i++) {
                    const element = h2Elements[i];
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= window.innerHeight) {
                        current = element.id;
                        break;
                    }
                }
            }

            if (current) {
                setActiveId(current);
            }
        };

        // Throttle scroll events
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Wait for DOM to be ready
        const timeoutId = setTimeout(() => {
            handleScroll();
        }, 200);

        // Listen to scroll on both window and documentation container
        const docContainer = document.querySelector(".documentation-container");

        window.addEventListener("scroll", throttledHandleScroll, {
            passive: true,
        });

        if (docContainer) {
            docContainer.addEventListener("scroll", throttledHandleScroll, {
                passive: true,
            });
        }

        handleScroll(); // Initial check

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("scroll", throttledHandleScroll);
            if (docContainer) {
                docContainer.removeEventListener(
                    "scroll",
                    throttledHandleScroll
                );
            }
        };
    }, [headings]);

    if (headings.length === 0) {
        return null;
    }

    const scrollToHeading = (id) => {
        // Try multiple times in case DOM isn't ready
        const attemptScroll = (attempts = 0) => {
            const element = document.getElementById(id);
            if (element) {
                // Use scrollIntoView with block: 'start' and behavior: 'smooth'
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Also manually adjust for offset
                setTimeout(() => {
                    const rect = element.getBoundingClientRect();
                    const offset = 100;
                    if (rect.top < offset) {
                        window.scrollBy({
                            top: rect.top - offset,
                            behavior: "smooth",
                        });
                    }
                }, 100);

                // Update active state immediately for better UX
                setActiveId(id);
            } else if (attempts < 5) {
                // Retry if element not found (DOM might not be ready)
                setTimeout(() => attemptScroll(attempts + 1), 50);
            }
        };

        attemptScroll();
    };

    return (
        <aside className="table-of-contents">
            <div className="toc-header">On this page</div>
            <nav className="toc-nav">
                {headings.map((heading, index) => (
                    <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`toc-item ${
                            activeId === heading.id ? "active" : ""
                        }`}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToHeading(heading.id);
                        }}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </aside>
    );
}
