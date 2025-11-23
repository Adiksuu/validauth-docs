export default async function checkForUpdates() {
    try {
        // Use GitHub API directly to get the latest release
        const response = await fetch(`https://api.github.com/repos/Adiksuu/validauth/releases/latest`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();
        
        // Extract version from tag_name (e.g., "v1.2.1" or "1.2.1")
        if (data.tag_name) {
            return data.tag_name.startsWith('v') ? data.tag_name : `v${data.tag_name}`;
        }
        
        return 'Latest';
    } catch (error) {
        console.error('Error checking for updates:', error);
        return 'Latest';
    }
};