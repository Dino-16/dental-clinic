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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-200/20 rounded-full blur-[80px]" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-200/20 rounded-full blur-[80px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[380px] relative z-10"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 group mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 transition-transform group-hover:scale-110">
                            <Stethoscope size={22} />
                        </div>
                        <div className="text-left leading-none">
                            <span className="text-lg font-black text-slate-900">SMILE<span className="text-blue-600">CARE</span></span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">Secure Admin Portal</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-normal text-slate-900 tracking-tight">Admin Access</h1>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1 mb-2">Access Key</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-11 pr-5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-[11px] font-bold"
                            >
                                <Shield size={14} className="flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white rounded-xl py-3.5 text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.97] shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
                        >
                            Connect <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Demo:</span>
                            <span className="text-[9px] font-black text-blue-600 tracking-widest">admin123</span>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Authorized Personnel Only
                </p>
            </motion.div>
        </div>
    );
}

export default LoginPage;
