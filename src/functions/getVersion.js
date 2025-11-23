export default async function checkForUpdates() {
    try {
        const response = await fetch(`https://allyai-backend.onrender.com/api/release/Adiksuu/validauth`);
        const data = await response.json();

        if (data.success) {
            return data.release.version
        } else {
            return 'Latest'
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
        // For testing purposes, you can uncomment the mock data below
        /*
        const mockData = {
            success: true,
            repository: "Adiksuu/AllyAI-mobile",
            release: {
                version: "v1.1.0",
                name: "AllyAI v1.1.0",
                description: "New features and improvements for better user experience.",
                publishedAt: "2025-09-20T14:12:03Z",
                downloadUrl: "https://github.com/Adiksuu/AllyAI-mobile/releases/tag/v1.1.0",
                zipUrl: "https://api.github.com/repos/Adiksuu/AllyAI-mobile/zipball/v1.1.0",
                tarUrl: "https://api.github.com/repos/Adiksuu/AllyAI-mobile/tarball/v1.1.0",
                author: "Adiksuu",
                isPrerelease: false,
                isDraft: false,
                isNewer: true,
                currentVersion: "v1.0.0"
            },
            updateAvailable: true,
            comparedVersion: "v1.0.0"
        };
        setUpdateData(mockData);
        setShowUpdateModal(true);
        */
    }
};