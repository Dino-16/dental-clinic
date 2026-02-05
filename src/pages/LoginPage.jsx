import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, Stethoscope } from 'lucide-react';

function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            localStorage.setItem('smilecare_auth', 'true');
            navigate('/dashboard');
        } else {
            setError('Invalid credentials. Please try "admin123"');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/30 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200/30 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 group mb-8">
                        <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                            <Stethoscope size={28} />
                        </div>
                        <div className="text-left">
                            <span className="text-xl font-black text-slate-900 block">SmileCare</span>
                            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest -mt-1">Secure Admin</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2 font-medium">Access your clinic control center</p>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Security Key</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-xs font-bold"
                            >
                                <Shield size={16} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-slate-950 text-white rounded-2xl py-4 font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
                        >
                            Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Demo Access:</span>
                            <span className="text-[10px] font-bold text-sky-600">admin123</span>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm font-medium text-slate-400">
                    Need help? <a href="#" className="text-sky-600 hover:underline">Contact System Admin</a>
                </p>
            </motion.div>
        </div>
    );
}

export default LoginPage;
