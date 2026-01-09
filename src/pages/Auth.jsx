import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showOtp, setShowOtp] = useState(false);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [institute, setInstitute] = useState('');
    const [otp, setOtp] = useState('');

    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register, verifyOtp, resendOtp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);

        try {
            if (showOtp) {
                // Verify OTP Flow
                await verifyOtp(email, otp);
                navigate('/');
            } else if (isLogin) {
                // Login Flow
                await login(email, password);
                navigate('/');
            } else {
                // Register Flow
                const res = await register(email, password, name, institute);
                if (res.requiresVerification) {
                    setShowOtp(true);
                    setMsg(res.message);
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            if (err.isUnverified) {
                setShowOtp(true);
                setError(err.message);
                // Trigger resend logic if needed, or just let them enter OTP if they have one?
                // Usually sending a fresh OTP is better if they are stuck. 
                // Let's offer a "Resend" button in the OTP view.
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setError('');
        setMsg('');
        try {
            await resendOtp(email);
            setMsg('OTP resent successfully to ' + email);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleManualVerifyClick = async () => {
        if (!email) {
            setError("Please enter your email address first to verify.");
            return;
        }
        setShowOtp(true);
        // Try to resend OTP immediately so they have a code
        handleResendOtp();
    };

    return (
        <div className="min-h-screen min-h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
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
                        {showOtp
                            ? 'Verify your email address.'
                            : (isLogin ? 'Welcome back! Please login.' : 'Create an account to start tracking.')
                        }
                    </p>
                </div>

                <div className="card shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!showOtp && !isLogin && (
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
                                            required={!isLogin}
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
                                            required={!isLogin}
                                            value={institute}
                                            onChange={(e) => setInstitute(e.target.value)}
                                            placeholder="e.g. Shishu vishwavidyalaya"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email Input - Always visible unless OTP and email is already set? No, verify might need correction. */}
                        {/* Actually, for OTP we assume email is correct from previous step. But what if they typoed? */}
                        {/* Let's keep email visible but read-only if showOtp? Or just allow editing. */}

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    disabled={showOtp}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all ${showOtp ? 'opacity-75 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>

                        {!showOtp && (
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
                        )}

                        {showOtp && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2"
                            >
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Verification Code (OTP)
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all tracking-widest font-mono text-lg"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-xs text-primary-600 font-bold hover:underline"
                                        disabled={loading}
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </motion.div>
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

                        {msg && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium"
                            >
                                {msg}
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
                                    <span>{showOtp ? 'Verify & Login' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-2">
                        {!showOtp && (
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-primary-600 font-bold hover:underline"
                                >
                                    {isLogin ? 'Sign Up' : 'Log In'}
                                </button>
                            </p>
                        )}

                        {/* Verify Button for Login Page */}
                        {!showOtp && isLogin && (
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Account not verified?{' '}
                                <button
                                    onClick={handleManualVerifyClick}
                                    className="text-primary-600 font-bold hover:underline"
                                >
                                    Verify Email
                                </button>
                            </p>
                        )}

                        {showOtp && (
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Entered wrong email?{' '}
                                <button
                                    onClick={() => setShowOtp(false)}
                                    className="text-primary-600 font-bold hover:underline"
                                >
                                    Go Back
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Info Text */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                        Your data is securely stored in your account.
                    </p>
                    <p className="text-xs font-medium bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent opacity-80">
                        Developed by Sankalp Sachan
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
