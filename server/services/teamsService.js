const axios = require('axios');

async function postToTeams(webhookUrl, userName, summaryText) {
    if (!webhookUrl) return { success: false, message: 'No webhook URL provided.' };

    try {
        // 1. If a Slack Webhook URL is pasted
        if (webhookUrl.includes('hooks.slack.com')) {
            await axios.post(webhookUrl, {
                text: `*📊 SmartTeam Daily Report: ${userName}*\n\n${summaryText}`
            });
            return { success: true, message: 'Posted to Slack channel successfully.' };
        }

        // 2. If a Discord Webhook URL is pasted (Alternative free option)
        if (webhookUrl.includes('discord.com/api/webhooks')) {
            await axios.post(webhookUrl, {
                username: 'SmartTeam Bot',
                embeds: [{
                    title: `📊 SmartTeam Daily Report: ${userName}`,
                    description: summaryText,
                    color: 2589163
                }]
            });
            return { success: true, message: 'Posted to Discord channel successfully.' };
        }

        // 3. Standard Microsoft Teams Workflow Adaptive Card payload
        const cardPayload = {
            type: "message",
            attachments: [
                {
                    contentType: "application/vnd.microsoft.card.adaptive",
                    content: {
                        type: "AdaptiveCard",
                        version: "1.2",
                        body: [
                            {
                                type: "TextBlock",
                                text: `📊 SmartTeam Daily Report: ${userName}`,
                                weight: "Bolder",
                                size: "Medium",
                                color: "Accent"
                            },
                            {
                                type: "TextBlock",
                                text: summaryText,
                                wrap: true
                            }
                        ]
                    }
                }
            ]
        };

        await axios.post(webhookUrl, cardPayload);
        return { success: true, message: 'Posted to Microsoft Teams successfully.' };
    } catch (err) {
        console.error('Webhook dispatch error:', err.message);
        return { success: false, message: 'Failed to post to webhook.' };
    }
}

module.exports = { postToTeams };