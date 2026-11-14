const axios = require('axios');

async function fetchJiraActivity(email, domain, apiToken) {
    if (!email || !domain || !apiToken) {
        console.log('Jira Service: Missing one or more required credentials.');
        return 'Jira account not linked.';
    }

    try {
        console.log(`Jira Service: Connecting to domain "${domain}" with email "${email}"...`);
        const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
        const jql = encodeURIComponent('updated >= "-24h" ORDER BY updated DESC');
        const url = `https://${domain}/rest/api/3/search/jql?jql=${jql}&fields=summary,status`;

        const res = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        const rawIssues = res.data.issues || [];
        const issues = rawIssues.map(issue => {
            const summary = issue.fields?.summary || 'No summary';
            const status = issue.fields?.status?.name || 'Unknown';
            return `[${issue.key}] ${summary} (Status: ${status})`;
        });

        return issues.length > 0 ? issues.join('\n') : 'No recent Jira ticket updates in the last 24 hours.';
    } catch (err) {
        console.error('❌ Jira fetch failed with error:', err.message);
        return 'Failed to fetch Jira activity.';
    }
}

module.exports = { fetchJiraActivity };