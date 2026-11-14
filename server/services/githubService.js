const axios = require('axios');

async function fetchGitHubActivity(username, token) {
    if (!username) {
        console.log('GitHub Service: No username provided.');
        return 'GitHub account not linked.';
    }

    try {
        console.log(`GitHub Service: Attempting to fetch public events for user: "${username}"`);
        
        const headers = token ? { Authorization: `token ${token}` } : {};
        headers['User-Agent'] = 'SmartTeam-Bot';

        const url = `https://api.github.com/users/${username}/events/public`;
        const res = await axios.get(url, { headers });

        console.log(`GitHub Service: Successfully fetched ${res.data.length} total events from GitHub API.`);

        const past24Hours = Date.now() - (24 * 60 * 60 * 1000);
        const recentEvents = res.data.filter(event => new Date(event.created_at).getTime() > past24Hours);

        const activities = recentEvents.map(event => {
            if (event.type === 'PushEvent') {
                const commits = event.payload?.commits?.length
                    ? event.payload.commits.map(c => c.message).join(', ')
                    : `Pushed commits to branch ${event.payload?.ref?.replace('refs/heads/', '') || 'main'}`;
                return `Pushed to ${event.repo.name}: ${commits}`;
            } else if (event.type === 'PullRequestEvent') {
                return `${event.payload.action} PR in ${event.repo.name}: ${event.payload.pull_request.title}`;
            } else if (event.type === 'CreateEvent') {
                return `Created ${event.payload.ref_type} in ${event.repo.name}`;
            }
            return null;
        }).filter(Boolean);

        if (activities.length > 0) {
            return activities.join('\n');
        } else {
            return 'No major GitHub activity in the last 24 hours.';
        }

    } catch (err) {
        console.error('❌ GitHub fetch failed with error:', err.message);
        return 'Failed to fetch GitHub activity.';
    }
}

module.exports = { fetchGitHubActivity };