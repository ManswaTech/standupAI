import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosClient';

export default function Settings() {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [savedStatus, setSavedStatus] = useState({
        hasGithubToken: false,
        hasJiraToken: false,
        hasWebhook: false
    });
    const [form, setForm] = useState({
        githubUsername: '',
        githubToken: '',
        jiraEmail: '',
        jiraDomain: '',
        jiraToken: '',
        teamsWebhookUrl: '',
        scheduledTime: '10:00',
        isActive: true
    });
    const [statusMsg, setStatusMsg] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return navigate('/login');
        API.get('/config')
            .then(res => {
                setSavedStatus({
                    hasGithubToken: Boolean(res.data.githubToken),
                    hasJiraToken: Boolean(res.data.jiraToken),
                    hasWebhook: Boolean(res.data.teamsWebhookUrl)
                });
                // Keep token inputs empty so user never types over '••••••••'
                setForm({
                    githubUsername: res.data.githubUsername || '',
                    githubToken: '',
                    jiraEmail: res.data.jiraEmail || '',
                    jiraDomain: res.data.jiraDomain || '',
                    jiraToken: '',
                    teamsWebhookUrl: '',
                    scheduledTime: res.data.scheduledTime || '10:00',
                    isActive: res.data.isActive ?? true
                });
            })
            .catch(() => navigate('/login'));
    }, [token, navigate]);

    const handleSaveConfig = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put('/config', form);
            setStatusMsg(res.data.message || 'Settings saved successfully!');
            // Update badges and clear raw secret inputs after saving
            setSavedStatus(prev => ({
                hasGithubToken: prev.hasGithubToken || Boolean(form.githubToken),
                hasJiraToken: prev.hasJiraToken || Boolean(form.jiraToken),
                hasWebhook: prev.hasWebhook || Boolean(form.teamsWebhookUrl)
            }));
            setForm(prev => ({ ...prev, githubToken: '', jiraToken: '', teamsWebhookUrl: '' }));
        } catch (err) {
            setStatusMsg('Error saving configuration.');
        }
    };

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <nav className={`border-b px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded">⚡</span> SmartTeam <span className="text-xs font-normal px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">Settings</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                        ← Back to Dashboard
                    </Link>
                    <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="px-4 py-1.5 bg-red-600/10 text-red-500 rounded-lg text-xs font-semibold cursor-pointer">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto p-6">
                <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h2 className="font-bold text-lg mb-1">API & Integration Settings</h2>
                    <p className="text-xs text-slate-400 mb-6">Configure your credentials once. Leave secret token fields blank to keep your existing saved keys.</p>

                    {statusMsg && (
                        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                            {statusMsg}
                        </div>
                    )}

                    <form onSubmit={handleSaveConfig} className="space-y-4">
                        <h3 className="font-bold text-sm text-blue-500">GitHub Credentials</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs mb-1">GitHub Username</label>
                                <input
                                    placeholder="e.g., poojithamallavarapu39"
                                    value={form.githubUsername}
                                    onChange={e => setForm({ ...form, githubUsername: e.target.value })}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">
                                    GitHub Token {savedStatus.hasGithubToken && <span className="text-emerald-500 font-semibold">(✓ Saved)</span>}
                                </label>
                                <input
                                    type="password"
                                    placeholder={savedStatus.hasGithubToken ? '•••••••• (Enter new token to replace)' : 'Paste GitHub PAT'}
                                    value={form.githubToken}
                                    onChange={e => setForm({ ...form, githubToken: e.target.value })}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`}
                                />
                            </div>
                        </div>

                        <h3 className="font-bold text-sm text-blue-500 pt-2">Jira Credentials</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs mb-1">Jira Email</label>
                                <input
                                    placeholder="you@example.com"
                                    value={form.jiraEmail}
                                    onChange={e => setForm({ ...form, jiraEmail: e.target.value })}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Jira Domain</label>
                                <input
                                    placeholder="yourorg.atlassian.net"
                                    value={form.jiraDomain}
                                    onChange={e => setForm({ ...form, jiraDomain: e.target.value })}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs mb-1">
                                Jira API Token {savedStatus.hasJiraToken && <span className="text-emerald-500 font-semibold">(✓ Saved)</span>}
                            </label>
                            <input
                                type="password"
                                placeholder={savedStatus.hasJiraToken ? '•••••••• (Enter new token to replace)' : 'Paste Jira API Token'}
                                value={form.jiraToken}
                                onChange={e => setForm({ ...form, jiraToken: e.target.value })}
                                className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`}
                            />
                        </div>

                        <h3 className="font-bold text-sm text-blue-500 pt-2">Slack / MS Teams & Schedule</h3>
                        <div>
                            <label className="block text-xs mb-1">
                                Webhook URL {savedStatus.hasWebhook && <span className="text-emerald-500 font-semibold">(✓ Saved)</span>}
                            </label>
                            <input
                                type="password"
                                placeholder={savedStatus.hasWebhook ? '•••••••• (Enter new URL to replace)' : 'Paste Slack or Teams Webhook URL'}
                                value={form.teamsWebhookUrl}
                                onChange={e => setForm({ ...form, teamsWebhookUrl: e.target.value })}
                                className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`}
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-1">
                            <input
                                type="time"
                                value={form.scheduledTime}
                                onChange={e => setForm({ ...form, scheduledTime: e.target.value })}
                                className={`p-2 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`}
                            />
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                />
                                Enable Daily Automation
                            </label>
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm cursor-pointer mt-4">
                            Save Settings
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}