import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MarkdownRenderer from "../components/MarkdownRenderer/MarkdownRenderer";
import RouteLoader from "../components/Loader/RouteLoader";
import TableOfContents from "../components/TableOfContents/TableOfContents";
import NextDocument from "../components/NextDocument/NextDocument";
import checkForUpdates from "../functions/getVersion";

// Import all markdown files using Vite's glob import
const markdownModules = import.meta.glob("../docs/*.md", {
    as: "raw",
    eager: false,
});

export default function Documentation() {
    const { docName } = useParams();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [packageVersion, setPackageVersion] = useState('Latest');

    useEffect(() => {
        async function fetchVersion() {
            const version = await checkForUpdates();
            setPackageVersion(version);
        }
        fetchVersion();
    }, [])

    useEffect(() => {
        const loadMarkdown = async () => {
            setLoading(true);
            setError(null);

            try {
                // Get the markdown file name from the route
                const fileName = `${docName}.md`;
                const filePath = `../docs/${fileName}`;

                // Check if the file exists in our modules
                const moduleLoader = markdownModules[filePath];

                if (!moduleLoader) {
                    throw new Error(`File ${fileName} not found`);
                }

                // Load the markdown content
                const text = await moduleLoader();
                setContent(text.replace('%version%', packageVersion));
            } catch (err) {
                console.error("Error loading markdown:", err);
                setError("Documentation not found");
                setContent(
                    "# Documentation Not Found\n\nThe requested documentation page could not be found."
                );
            } finally {
                setLoading(false);
            }
        };

        loadMarkdown();
    }, [docName, packageVersion]);

    if (loading) {
        return <RouteLoader />;
    }

    if (error) {
        return (
            <div className="documentation-wrapper">
                <div className="documentation-container">
                    <div className="documentation-error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="documentation-wrapper">
            <div className="documentation-container">
                <MarkdownRenderer content={content} />
                <NextDocument
                    currentPath={docName ? `/${docName}` : "/instalation"}
                />
            </div>
            <TableOfContents content={content} />
        </div>
    );
}
