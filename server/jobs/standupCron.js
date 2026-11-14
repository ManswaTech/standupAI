const cron = require('node-cron');
const User = require('../models/User');
const { decrypt } = require('../utils/encryption');
const { fetchGitHubActivity } = require('../services/githubService');
const { fetchJiraActivity } = require('../services/jiraService');
const { generateStandupSummary } = require('../services/aiService');
const { postToTeams } = require('../services/teamsService');

function initStandupCron() {
    // Runs every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            console.log(`[Cron Tick] Checking scheduled standups for time: ${currentTime} (Server Time)`);

            const users = await User.find({ isActive: true, scheduledTime: currentTime });
            console.log(`[Cron] Found ${users.length} active user(s) matching schedule.`);

            for (const user of users) {
                if (!user.teamsWebhookUrl) {
                    console.log(`[Cron] Skipped user ${user.name}: No webhook URL configured.`);
                    continue;
                }

                console.log(`[Cron] Starting automated standup dispatch for ${user.name}...`);

                const ghToken = user.githubToken ? decrypt(user.githubToken) : '';
                const jiraToken = user.jiraToken ? decrypt(user.jiraToken) : '';
                const teamsUrl = decrypt(user.teamsWebhookUrl);

                const githubLogs = await fetchGitHubActivity(user.githubUsername, ghToken);
                const jiraLogs = await fetchJiraActivity(user.jiraEmail, user.jiraDomain, jiraToken);

                const summary = await generateStandupSummary(githubLogs, jiraLogs);
                await postToTeams(teamsUrl, user.name, summary);
                
                console.log(`✅ [Cron] Standup successfully dispatched to Slack/Teams for ${user.name}`);
            }
        } catch (err) {
            console.error('❌ [Cron Error]:', err.message);
        }
    });
}

module.exports = initStandupCron;