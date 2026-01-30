import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../components/Modal';
import TermsContent from '../components/TermsContent';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [institute, setInstitute] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [acceptedTermsLocal, setAcceptedTermsLocal] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

    const { login, register, googleLogin, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            localStorage.setItem('attendly_pending_referral', ref);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!acceptedTermsLocal) {
            setError('Please accept the Terms and Conditions to continue.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login Flow
                await login(email, password, acceptedTermsLocal);
                navigate('/');
            } else {
                // Register Flow
                await register(email, password, name, institute, acceptedTermsLocal);
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const userData = await googleLogin(credentialResponse.credential, acceptedTermsLocal);
            if (userData.institute === 'Google User' || !userData.institute) {
                setIsOnboarding(true);
                setLoading(false);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || "Google Login Failed");
            setLoading(false);
        }
    };

    const handleOnboardingSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await updateUserProfile({ institute });
            navigate('/');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
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
                        {isOnboarding
                            ? 'Almost there! Just one more step.'
                            : (isLogin ? 'Welcome back! Please login.' : 'Create an account to start tracking.')}
                    </p>
                </div>

                <div className="card shadow-2xl">
                    {isOnboarding ? (
                        <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2"
                            >
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
                                        <span>Complete Setup</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
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
                                        placeholder="youremail@email.com"
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

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4 pt-2">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={acceptedTermsLocal}
                                        onChange={(e) => setAcceptedTermsLocal(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer">
                                        I accept the <button type="button" onClick={(e) => { e.preventDefault(); setIsTermsModalOpen(true); }} className="font-bold text-slate-700 dark:text-slate-200 hover:underline">Terms & Conditions</button>.
                                        <br />
                                        <span className="italic">Note: This app is not authorized by any college authority. It is designed solely for loyalty and tracking purposes.</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full btn-primary py-4 mt-2 h-[56px] ${!acceptedTermsLocal ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                </div>

                {!isOnboarding && (
                    <div className="mt-6">
                        <div className="relative flex py-2 items-center mb-4">
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold">OR</span>
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Login Failed')}
                                theme="filled_blue"
                                shape="circle"
                                width="300"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center space-y-2">
                    {!isOnboarding && (
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
                </div>
                {/* Info Text */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                        Your data is securely stored in your account.
                    </p>
                    <Link to="/about-developer" className="text-xs font-medium bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent opacity-80 hover:opacity-100 transition-opacity">
                        Developed by Sankalp Sachan
                    </Link>
                </div>
            </motion.div>

            <Modal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                title="Terms & Conditions"
                footer={
                    <button
                        onClick={() => {
                            setAcceptedTermsLocal(true);
                            setIsTermsModalOpen(false);
                        }}
                        className="w-full btn-primary py-4"
                    >
                        Accept & Close
                    </button>
                }
            >
                <div className="text-[12px] opacity-90">
                    <TermsContent />
                </div>
            </Modal>
        </div>
    );
};

export default Auth;

