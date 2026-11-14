const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateStandupSummary(githubLogs, jiraLogs) {
    const prompt = `
You are an AI engineering assistant. Synthesize the following raw GitHub and Jira activity logs from the past 24 hours into a professional, concise daily standup report divided strictly into 3 sections:
1. Completed Work
2. Planned Tasks (Today)
3. Blockers / Impediments

GitHub Activity:
${githubLogs}

Jira Activity:
${jiraLogs}

Rules:
- If either GitHub or Jira activity indicates "account not linked", reflect that clearly in Completed Work or Blockers.
- Do NOT use any Markdown formatting symbols such as **, ###, or *. Use plain text with standard dashes (-) for bullet points.
`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];

    for (const modelName of modelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });

            if (response && response.text) {
                // Clean any stray markdown bold/header characters
                return response.text
                    .replace(/\*\*/g, '')
                    .replace(/###\s?/g, '')
                    .replace(/^\*\s/gm, '- ')
                    .trim();
            }
        } catch (err) {
            console.error(`❌ AI Service error with model (${modelName}):`, err.message);
        }
    }

    return `📊 SmartTeam Daily Report\n\n1. Completed Work\n- GitHub: ${githubLogs}\n- Jira: ${jiraLogs}\n\n2. Planned Tasks (Today)\n- Continue active sprint backlog items.\n\n3. Blockers / Impediments\n- AI service busy / integration check required.`;
}

module.exports = { generateStandupSummary };