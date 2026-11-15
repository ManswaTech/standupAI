import { useState, useEffect } from 'react';
import API from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await API.post('/auth/register', form);
        alert(res.data?.message || 'Registration approved! Confirmation email sent.');
        navigate('/login');
    } catch (err) {
        alert(err.response?.data?.message || 'Registration failed');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            
            {/* Top Navigation Bar */}
            <header className={`w-full border-b transition-colors ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            ⚡
                        </div>
                        <span className="font-bold text-xl tracking-tight">SmartTeam</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            aria-label="Toggle Theme"
                            className={`p-2 rounded-lg border text-sm transition-colors cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {darkMode ? '☀️ Light' : '🌙 Dark'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Registration Card Main Container */}
            <main className="flex items-center justify-center px-4 py-12">
                <div className={`max-w-md w-full rounded-2xl border p-8 shadow-xl transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    
                    {/* Header Branding */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 mb-3 text-2xl font-bold">
                            ⚡
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight">Create an Account</h2>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Get started with automated AI standup syncs</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Full Name
                            </label>
                            <input 
                                name="name" 
                                type="text"
                                placeholder="John Doe" 
                                value={form.name}
                                onChange={handleChange} 
                                required 
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600' : 'bg-white border-slate-300 text-slate-900'}`}
                            />
                        </div>

                        <div>
                            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Email Address
                            </label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="name@example.com" 
                                value={form.email}
                                onChange={handleChange} 
                                required 
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600' : 'bg-white border-slate-300 text-slate-900'}`}
                            />
                        </div>

                        <div>
                            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Password
                            </label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••••" 
                                value={form.password}
                                onChange={handleChange} 
                                required 
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600' : 'bg-white border-slate-300 text-slate-900'}`}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <p className={`text-center text-sm mt-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className={`border-t py-6 text-center text-xs ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                SmartTeam Automated Standup Platform © {new Date().getFullYear()}
            </footer>
        </div>
    );
}
