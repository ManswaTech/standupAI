import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosClient';

export default function Dashboard() {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
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
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return navigate('/login');
        API.get('/config')
            .then(res => {
                setForm(prev => ({ ...prev, ...res.data }));
            })
            .catch(() => {
                // If token is invalid/expired, clear local storage and send to login
                localStorage.removeItem('token');
                navigate('/login');
            });
    }, [token, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put('/config', form);
            alert(res.data.message || 'Configuration updated successfully.');
        } catch (err) {
            alert('Error saving configuration');
        }
    };

    const handleTestNow = async () => {
        setLoading(true);
        try {
            const res = await API.post('/config/trigger-now', {});
            setPreview(res.data.summary);
            alert(res.data.message || 'Standup generated!');
        } catch (err) {
            alert('Failed to run test standup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-colors font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            {/* Navbar */}
            <nav className={`border-b px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded">⚡</span> SmartTeam <span className="text-xs font-normal px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">Workspace</span>
                </Link>
                <div className="flex items-center gap-3">
                    <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer">
                        {darkMode ? '☀️ Light' : '🌙 Dark'}
                    </button>
                    <button 
                        onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                        className="px-4 py-1.5 bg-red-600/10 text-red-500 hover:bg-red-600/20 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto p-6">
                <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h2 className="text-xl font-bold mb-1">Standup Bot Configuration</h2>
                    <p className="text-xs text-slate-400 mb-6">Manage your GitHub, Jira, and Teams/Slack integrations and automation schedule.</p>

                    <form onSubmit={handleSave} className="space-y-4">
                        <h3 className="font-bold text-sm text-blue-500">GitHub Integration</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input 
                                placeholder="GitHub Username" 
                                value={form.githubUsername} 
                                onChange={e => setForm({ ...form, githubUsername: e.target.value })} 
                                className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`} 
                            />
                            <input 
                                type="password" 
                                placeholder="GitHub Token (leave blank to keep)" 
                                value={form.githubToken} 
                                onChange={e => setForm({ ...form, githubToken: e.target.value })} 
                                className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`} 
                            />
                        </div>

                        <h3 className="font-bold text-sm text-blue-500 pt-2">Jira Integration</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input 
                                placeholder="Jira Email" 
                                value={form.jiraEmail} 
                                onChange={e => setForm({ ...form, jiraEmail: e.target.value })} 
                                className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`} 
                            />
                            <input 
                                placeholder="Jira Domain (e.g. org.atlassian.net)" 
                                value={form.jiraDomain} 
                                onChange={e => setForm({ ...form, jiraDomain: e.target.value })} 
                                className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`} 
                            />
                        </div>
                        <input 
                            type="password" 
                            placeholder="Jira API Token (leave blank to keep)" 
                            value={form.jiraToken} 
                            onChange={e => setForm({ ...form, jiraToken: e.target.value })} 
                            className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`} 
                        />

                        <h3 className="font-bold text-sm text-blue-500 pt-2">Webhook & Schedule</h3>
                        <input 
                            type="password" 
                            placeholder="Slack / Teams Webhook URL (leave blank to keep)" 
                            value={form.teamsWebhookUrl} 
                            onChange={e => setForm({ ...form, teamsWebhookUrl: e.target.value })} 
                            className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white'}`} 
                        />
                        
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

                        <div className="flex gap-3 pt-4">
                            <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm cursor-pointer">Save Settings</button>
                            <button type="button" onClick={handleTestNow} disabled={loading} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm cursor-pointer">
                                {loading ? 'Running...' : 'Run & Test Now'}
                            </button>
                        </div>
                    </form>

                    {preview && (
                        <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                            <h4 className="font-bold text-sm mb-2">Generated Standup Preview:</h4>
                            <pre className="whitespace-pre-wrap text-xs">{preview}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}