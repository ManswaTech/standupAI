import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosClient';

export default function EmployeeDashboard() {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [configSummary, setConfigSummary] = useState(null);
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return navigate('/login');

        API.get('/config')
            .then(res => setConfigSummary(res.data))
            .catch(() => navigate('/login'));

        API.get('/auth/me')
            .then(res => setProfile({ name: res.data.name, email: res.data.email }))
            .catch(() => {});
    }, [token, navigate]);

    const handleTestNow = async () => {
        setLoading(true);
        try {
            const res = await API.post('/config/trigger-now', {});
            setPreview(res.data.summary);
        } catch (err) {
            alert('Failed to generate test standup');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            await API.put('/auth/profile', profile);
            alert('Profile updated successfully!');
            setShowProfileModal(false);
        } catch (err) {
            alert('Failed to update profile.');
        }
    };

    return (
        <div className={`min-h-screen transition-colors font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <nav className={`border-b px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded">⚡</span> SmartTeam <span className="text-xs font-normal px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">Employee</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link to="/settings" className="px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 text-xs font-semibold">
                        ⚙️ Settings
                    </Link>
                    <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer">
                        {darkMode ? '☀️ Light' : '🌙 Dark'}
                    </button>
                    {/* Clickable Profile Icon */}
                    <button
                        onClick={() => setShowProfileModal(true)}
                        title="Edit Profile"
                        className="w-8 h-8 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 flex items-center justify-center font-bold text-xs border border-blue-500/30 cursor-pointer"
                    >
                        {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                    </button>
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/login'); }} className="px-4 py-1.5 bg-red-600/10 text-red-500 hover:bg-red-600/20 rounded-lg text-xs font-semibold cursor-pointer">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto p-6">
                <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-bold text-base">Connected Integrations</h3>
                            <p className="text-xs text-slate-400">Your saved credentials are automatically reused for every standup.</p>
                        </div>
                        <Link to="/settings" className="text-xs text-blue-500 hover:underline font-medium">
                            Edit Credentials →
                        </Link>
                    </div>

                    {configSummary && (
                        <div className="grid sm:grid-cols-3 gap-3 mb-6 text-xs">
                            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <span className="text-slate-400 block">GitHub User</span>
                                <span className="font-semibold">{configSummary.githubUsername || 'Not configured'}</span>
                            </div>
                            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <span className="text-slate-400 block">Jira Domain</span>
                                <span className="font-semibold">{configSummary.jiraDomain || 'Not configured'}</span>
                            </div>
                            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <span className="text-slate-400 block">Daily Schedule</span>
                                <span className="font-semibold">{configSummary.isActive ? `Active at ${configSummary.scheduledTime}` : 'Paused'}</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleTestNow}
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm cursor-pointer"
                    >
                        {loading ? 'Generating Standup...' : 'Run & Test Now'}
                    </button>

                    {preview && (
                        <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                            <h4 className="font-bold text-sm mb-2">Generated Standup Preview:</h4>
                            <pre className="whitespace-pre-wrap text-xs">{preview}</pre>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-md p-6 rounded-2xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <h3 className="text-lg font-bold mb-4">Edit My Profile</h3>
                        <form onSubmit={handleProfileSave} className="space-y-4">
                            <div>
                                <label className="block text-xs mb-1 opacity-80">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={profile.name}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-1 opacity-80">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50'}`}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer">Save Profile</button>
                                <button type="button" onClick={() => setShowProfileModal(false)} className={`flex-1 py-2 border rounded-xl text-xs font-semibold cursor-pointer ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}