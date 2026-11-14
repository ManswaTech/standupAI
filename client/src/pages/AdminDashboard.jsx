import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosClient';

export default function AdminDashboard() {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'employee' });
    const navigate = useNavigate();

    useEffect(() => {
        API.get('/auth/users')
            .then(res => setUsers(res.data))
            .catch(() => navigate('/login'));
    }, [navigate]);

    const handleRoleChange = async (id, newRole) => {
        try {
            await API.put(`/auth/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => (u._id === id ? { ...u, role: newRole } : u)));
        } catch (err) {
            alert('Failed to update user role.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await API.delete(`/auth/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert('Failed to delete user.');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put(`/auth/users/${editingUser._id}`, formData);
            setUsers(users.map(u => (u._id === editingUser._id ? res.data.user : u)));
            setEditingUser(null);
        } catch (err) {
            alert('Failed to update user details.');
        }
    };

    return (
        <div className={`min-h-screen transition-colors font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            {/* Navbar with Profile Icon */}
            <nav className={`border-b px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                    <span className="bg-amber-600 text-white px-2 py-0.5 rounded">⚡</span> SmartTeam <span className="text-xs font-normal px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">Admin Console</span>
                </Link>
                <div className="flex items-center gap-3">
                    {/* Profile Icon / Badge */}
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center font-bold text-xs border border-amber-500/30" title="Admin Profile">
                        👑
                    </div>
                    <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer">
                        {darkMode ? '☀️ Light' : '🌙 Dark'}
                    </button>
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/login'); }} className="px-4 py-1.5 bg-red-600/10 text-red-500 rounded-lg text-xs font-semibold cursor-pointer">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6 space-y-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h2 className="text-lg font-bold mb-4">User & Role Access Control</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Email</th>
                                    <th className="pb-3">Assigned Role</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td className="py-3 font-medium">{u.name}</td>
                                        <td className="py-3 opacity-80">{u.email}</td>
                                        <td className="py-3">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                className={`px-3 py-1 rounded-lg border text-xs ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                                            >
                                                <option value="employee">Employee</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="py-3 text-right space-x-2">
                                            <button 
                                                onClick={() => { setEditingUser(u); setFormData({ name: u.name, email: u.email, role: u.role }); }}
                                                className="px-3 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded text-xs font-semibold cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u._id)}
                                                className="px-3 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded text-xs font-semibold cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-md p-6 rounded-2xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <h3 className="text-lg font-bold mb-4">Edit User Credentials</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs mb-1 opacity-80">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-1 opacity-80">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full p-2.5 border rounded-lg text-sm ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50'}`}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer">Save Changes</button>
                                <button type="button" onClick={() => setEditingUser(null)} className={`flex-1 py-2 border rounded-xl text-xs font-semibold cursor-pointer ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}