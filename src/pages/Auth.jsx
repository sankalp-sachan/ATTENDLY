import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [view, setView] = useState('login'); // 'login', 'signup', 'verify'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [institute, setInstitute] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const { login, register, verifyEmail, resendVerificationCode } = useAuth();
    const navigate = useNavigate();

    // Timer effect
    React.useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        setError('');
        try {
            await resendVerificationCode(email);
            setResendTimer(30); // 30 seconds cooldown
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (view === 'login') {
                await login(email, password);
                navigate('/');
            } else if (view === 'signup') {
                const res = await register(email, password, name, institute);
                if (res.success) {
                    setView('verify');
                }
            } else if (view === 'verify') {
                await verifyEmail(email, otp);
                navigate('/');
            }
        } catch (err) {
            if (err.code === 'UNVERIFIED') {
                setError('Email not verified. Sending new code...');
                setView('verify');
                // Auto resend
                setTimeout(async () => {
                    await handleResend();
                }, 1000);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleView = () => {
        if (view === 'login') setView('signup');
        else setView('login');
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary-600 p-4 rounded-2xl text-white shadow-xl shadow-primary-500/20 mb-4 transform -rotate-6">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                        ATTENDLY
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        {view === 'login' && 'Welcome back! Please login.'}
                        {view === 'signup' && 'Create an account to start tracking.'}
                        {view === 'verify' && 'Verify your email address.'}
                    </p>
                </div>

                <div className="card shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <AnimatePresence mode="wait">
                            {view === 'signup' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Full Name"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all"
                                        />
                                    </div>

                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-2">
                                        Institute Name
                                    </label>
                                    <div className="relative">
                                        <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={institute}
                                            onChange={(e) => setInstitute(e.target.value)}
                                            placeholder="e.g. Shishu vishwavidyalaya"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {view !== 'verify' && (
                            <>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {view === 'verify' && (
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Verification Code
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all tracking-widest text-center text-lg"
                                    />
                                </div>
                                <p className="text-xs text-center text-slate-500">
                                    We sent a code to <span className="font-bold text-slate-700 dark:text-slate-300">{email}</span>
                                </p>
                                <div className="text-center mt-2">
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={loading || resendTimer > 0}
                                        className="text-primary-600 text-xs font-bold hover:underline disabled:text-slate-400 disabled:no-underline"
                                    >
                                        {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 mt-2 h-[56px]"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>
                                        {view === 'login' && 'Sign In'}
                                        {view === 'signup' && 'Create Account'}
                                        {view === 'verify' && 'Verify Email'}
                                    </span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {view === 'login' && (
                                <>
                                    Don't have an account?{' '}
                                    <button onClick={() => setView('signup')} className="text-primary-600 font-bold hover:underline">
                                        Sign Up
                                    </button>
                                </>
                            )}
                            {view === 'signup' && (
                                <>
                                    Already have an account?{' '}
                                    <button onClick={() => setView('login')} className="text-primary-600 font-bold hover:underline">
                                        Log In
                                    </button>
                                </>
                            )}
                            {view === 'verify' && (
                                <button onClick={() => setView('login')} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium">
                                    Back to Login
                                </button>
                            )}
                        </p>
                    </div>
                </div>

                {/* Info Text */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                        Your data is stored locally on this device. We don't send your password or attendance anywhere else.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
