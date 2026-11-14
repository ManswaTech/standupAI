const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/encryption');
const { fetchGitHubActivity } = require('../services/githubService');
const { fetchJiraActivity } = require('../services/jiraService');
const { generateStandupSummary } = require('../services/aiService');
const { postToTeams } = require('../services/teamsService');

// Get user configuration
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            githubUsername: user.githubUsername || '',
            githubToken: user.githubToken ? '••••••••' : '',
            jiraEmail: user.jiraEmail || '',
            jiraDomain: user.jiraDomain || '',
            jiraToken: user.jiraToken ? '••••••••' : '',
            teamsWebhookUrl: user.teamsWebhookUrl ? '••••••••' : '',
            scheduledTime: user.scheduledTime || '10:00',
            isActive: user.isActive ?? true
        });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving configuration' });
    }
});

// Update config & encrypt tokens
router.put('/', auth, async (req, res) => {
    try {
        const { githubUsername, githubToken, jiraEmail, jiraDomain, jiraToken, teamsWebhookUrl, scheduledTime, isActive } = req.body;
        const updateData = { githubUsername, jiraEmail, jiraDomain, scheduledTime, isActive };

        if (githubToken && !githubToken.includes('••••')) updateData.githubToken = encrypt(githubToken);
        if (jiraToken && !jiraToken.includes('••••')) updateData.jiraToken = encrypt(jiraToken);
        if (teamsWebhookUrl && !teamsWebhookUrl.includes('••••')) updateData.teamsWebhookUrl = encrypt(teamsWebhookUrl);

        await User.findByIdAndUpdate(req.user.id, updateData);
        res.json({ message: 'SmartTeam configuration updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating configuration' });
    }
});

// Manual Test Trigger
router.post('/trigger-now', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const ghToken = user.githubToken ? decrypt(user.githubToken) : '';
        const jiraToken = user.jiraToken ? decrypt(user.jiraToken) : '';
        const teamsUrl = user.teamsWebhookUrl ? decrypt(user.teamsWebhookUrl) : '';

        const githubLogs = await fetchGitHubActivity(user.githubUsername, ghToken);
        const jiraLogs = await fetchJiraActivity(user.jiraEmail, user.jiraDomain, jiraToken);
        const summary = await generateStandupSummary(githubLogs, jiraLogs);

        if (teamsUrl) {
            await postToTeams(teamsUrl, user.name, summary);
        }

        res.json({ message: 'Test standup generated and sent successfully!', summary });
    } catch (err) {
        res.status(500).json({ message: 'Failed to run test standup', error: err.message });
    }
});

// GET team members activity overview (Manager & Admin - excluding admins & self)
router.get('/team-activity', auth, verifyRole(['admin', 'manager']), async (req, res) => {
    try {
        const teamMembers = await User.find(
            { _id: { $ne: req.user.id }, role: { $ne: 'admin' } },
            'name email githubUsername jiraDomain isActive'
        );
        res.json(teamMembers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch team activity.' });
    }
});

module.exports = router;