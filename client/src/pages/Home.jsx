import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // Determine workspace path based on saved user role
    const savedRole = localStorage.getItem('role');
    const workspacePath =
        savedRole === 'admin'
            ? '/admin'
            : savedRole === 'manager'
            ? '/manager'
            : '/dashboard';

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            
            {/* Navbar */}
            <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            ⚡
                        </div>
                        <span className="font-bold text-xl tracking-tight">SmartTeam</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className={`hover:text-blue-600 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Features</a>
                        <a href="#workflow" className={`hover:text-blue-600 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>How It Works</a>
                        <Link to={workspacePath} className={`hover:text-blue-600 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Workspace</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            aria-label="Toggle Theme"
                            className={`p-2 rounded-lg border text-sm transition-colors cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {darkMode ? '☀️ Light' : '🌙 Dark'}
                        </button>
                        <Link to="/login" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}>
                            Log in
                        </Link>
                        <Link to="/register" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 border ${darkMode ? 'bg-blue-950/50 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                        <span>✨ Multi-Role Workspace & AI Standup Engine</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
                        Orchestrate teams, track performance, and automate syncs with <span className="text-blue-600">SmartTeam</span>.
                    </h1>
                    
                    <p className={`mt-6 text-lg max-w-2xl mx-auto leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        A unified platform featuring role-based dashboards for Admins, Managers, and Engineers to manage daily updates, sprint velocity, and automated GitHub & Jira standup reports.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all text-base">
                            Deploy SmartTeam Free
                        </Link>
                        <Link to={workspacePath} className={`w-full sm:w-auto px-8 py-3.5 font-semibold rounded-xl border transition-all text-base ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800'}`}>
                            Open Workspace →
                        </Link>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="workflow" className={`py-20 border-t ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold">How SmartTeam Works</h2>
                            <p className={`mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>From automated activity tracking to instant Slack & Teams distribution in 3 steps.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: '01', title: 'Connect Integrations', desc: 'Link your GitHub repositories and Jira boards securely using AES-256 encrypted tokens.' },
                                { step: '02', title: 'AI Synthesis & Tracking', desc: 'Gemini AI compiles daily activity logs while managers oversee sprint velocity and performance metrics.' },
                                { step: '03', title: 'Automated Delivery', desc: 'Cron runners dispatch clean, structured standup reports straight to your Slack or MS Teams channels.' }
                            ].map((item, idx) => (
                                <div key={idx} className={`p-8 rounded-2xl border relative ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                    <span className="text-4xl font-extrabold text-blue-600/30 absolute top-6 right-6">{item.step}</span>
                                    <h3 className="text-xl font-bold mb-3 mt-4">{item.title}</h3>
                                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className={`py-20 border-t ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold">Engineered for Complete Productivity</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: '🐙', title: 'GitHub & Jira Sync', desc: 'Pulls commit activity and issue status changes instantly.' },
                                { icon: '🤖', title: 'AI Standup Summaries', desc: 'Generates structured daily standups powered by Gemini AI.' },
                                { icon: '📊', title: 'Performance Metrics', desc: 'Transparent reporting dashboards for tracking engineering output.' }
                            ].map((item, idx) => (
                                <div key={idx} className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="text-3xl mb-4">{item.icon}</div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className={`border-t pt-16 pb-12 ${darkMode ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-900 text-slate-300'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 text-white">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">⚡</div>
                            <span className="font-bold text-lg">SmartTeam</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            The intelligent engineering operations platform uniting daily standups, performance tracking, and automated team workflows.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            All Systems Operational
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Platform</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#workflow" className="hover:text-white transition-colors">Workflow Automation</a></li>
                            <li><Link to="/login" className="hover:text-white transition-colors">Role Portals</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Access</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                            <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                            <li><Link to={workspacePath} className="hover:text-white transition-colors">Workspace Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Security & Trust</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                            Secured with AES-256 token encryption and role-based access control (RBAC).
                        </p>
                        <div className="text-xs font-mono bg-slate-800 text-slate-300 p-2.5 rounded border border-slate-700">
                            🔒 JWT Auth & Cron Active
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <p>© {new Date().getFullYear()} SmartTeam Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
                        <span className="hover:text-slate-400 cursor-pointer">Security Compliance</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}