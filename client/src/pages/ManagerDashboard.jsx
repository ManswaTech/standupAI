import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosClient';

export default function ManagerDashboard() {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [team, setTeam] = useState([]);
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        API.get('/config/team-activity')
            .then(res => setTeam(res.data))
            .catch(() => navigate('/login'));

        API.get('/auth/me')
            .then(res => setProfile({ name: res.data.name, email: res.data.email }))
            .catch(() => {});
    }, [navigate]);

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
                    <span className="bg-indigo-600 text-white px-2 py-0.5 rounded">⚡</span> SmartTeam <span className="text-xs font-normal px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Manager Portal</span>
                </Link>
                <div className="flex items-center gap-3">
                    <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer">
                        {darkMode ? '☀️ Light' : '🌙 Dark'}
                    </button>
                    {/* Clickable Profile Icon */}
                    <button
                        onClick={() => setShowProfileModal(true)}
                        title="Edit Profile"
                        className="w-8 h-8 rounded-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30 cursor-pointer"
                    >
                        {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                    </button>
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/login'); }} className="px-4 py-1.5 bg-red-600/10 text-red-500 rounded-lg text-xs font-semibold cursor-pointer">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6 space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4">Team Integration & Activity Overview</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {team.map((member) => (
                            <div key={member._id} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold">{member.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded ${member.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {member.isActive ? 'Active Bot' : 'Paused'}
                                    </span>
                                </div>
                                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email: <strong className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{member.email}</strong></p>
                                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>GitHub: <strong className="text-blue-500">{member.githubUsername || 'Not linked'}</strong></p>
                                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Jira Domain: <strong className="text-indigo-500">{member.jiraDomain || 'Not linked'}</strong></p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

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
                                <button type="submit" className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer">Save Profile</button>
                                <button type="button" onClick={() => setShowProfileModal(false)} className={`flex-1 py-2 border rounded-xl text-xs font-semibold cursor-pointer ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}