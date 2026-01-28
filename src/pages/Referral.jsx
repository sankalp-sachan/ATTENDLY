import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Gift, Copy, Check, Share2, Info,
    ArrowRight, Trophy, Users, Star, QrCode
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Referral = () => {
    const { user, applyReferralCode } = useAuth();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [referralCodeInput, setReferralCodeInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const pendingRef = localStorage.getItem('attendly_pending_referral');
        if (pendingRef) {
            setReferralCodeInput(pendingRef);
            localStorage.removeItem('attendly_pending_referral');
        }
    }, []);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(user.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleApplyCode = async (e) => {
        if (e) e.preventDefault();
        if (!referralCodeInput.trim()) return;

        setLoading(true);
        setError('');
        try {
            await applyReferralCode(referralCodeInput);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        setLoading(true);
        try {
            await applyReferralCode('');
            // Optional: redirect or just update UI
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const shareUrl = `${window.location.origin}/auth?ref=${user?.referralCode}`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Attendly!',
                    text: `Manage your attendance like a pro. Use my referral code: ${user.referralCode}`,
                    url: shareUrl,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            handleCopyCode();
        }
    };

    return (
        <div className="min-h-screen min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full glass border-b dark:border-slate-800 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tight">Refer & Earn</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-24">
                {/* Points Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-500 p-8 rounded-[2rem] text-white shadow-2xl shadow-primary-500/30 mb-8"
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md mb-4">
                            <Gift className="w-8 h-8" />
                        </div>
                        <p className="text-primary-100 font-bold uppercase tracking-widest text-xs mb-1">Total Rewards Earned</p>
                        <h2 className="text-6xl font-black mb-2">{user?.referralPoints || 0}</h2>
                        <div className="flex items-center gap-2 bg-black/10 px-4 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>1 Referral = 10 Points</span>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                </motion.div>

                {/* Main Content Grid */}
                <div className="space-y-6">

                    {/* Referral Code Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold">Your Referral Assets</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Copy Code */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">My Code</label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-black text-2xl tracking-[0.2em] text-center">
                                        {user?.referralCode}
                                    </div>
                                    <button
                                        onClick={handleCopyCode}
                                        className={`p-4 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 active:scale-95'}`}
                                    >
                                        {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center gap-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="bg-white p-4 rounded-3xl shadow-xl dark:shadow-none border dark:border-slate-700">
                                    <QRCodeCanvas
                                        value={shareUrl}
                                        size={180}
                                        level="H"
                                        includeMargin={true}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Share your QR Code</p>
                                    <p className="text-xs text-slate-400 mt-1">Friends can scan this to join Attendly instantly</p>
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share Referral Link
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enter Code Section (Only if not set) */}
                    {user?.hasSetReferral === false && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-3xl border border-primary-100 dark:border-primary-900/30 ring-4 ring-primary-500/5"
                        >
                            <div className="flex items-center gap-3 mb-4 text-primary-600">
                                <Trophy className="w-6 h-6" />
                                <h3 className="font-black">Were you referred?</h3>
                            </div>
                            <p className="text-sm text-primary-800 dark:text-primary-200 mb-6 font-medium">
                                Enter your friend's code to give them <span className="font-black text-primary-600">10 reward points</span>!
                            </p>

                            <form onSubmit={handleApplyCode} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="PASTE CODE HERE"
                                    value={referralCodeInput}
                                    onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-4 text-center text-xl font-black tracking-widest bg-white dark:bg-slate-900 border-2 border-primary-100 dark:border-primary-800 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all uppercase"
                                />

                                {error && (
                                    <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                                )}

                                {showSuccess && (
                                    <p className="text-green-500 text-xs font-bold text-center">Referral code applied successfully! 🎉</p>
                                )}

                                <div className="flex flex-col gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading || !referralCodeInput}
                                        className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>
                                                <span>Apply Code</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSkip}
                                        disabled={loading}
                                        className="text-slate-400 font-bold text-xs py-2 hover:text-slate-600 transition-colors"
                                    >
                                        I don't have a code
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* Info Section */}
                    <div className="p-6">
                        <div className="flex items-start gap-3 text-slate-400">
                            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-300">How it works</p>
                                    <p className="text-xs leading-relaxed mt-1">
                                        When someone signs up using your link or enters your code during onboarding, you receive 10 points.
                                        These points indicate your contribution to the Attendly community!
                                    </p>
                                </div>
                                <div className="pt-4 border-t dark:border-slate-800">
                                    <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Strict Anti-Spam Policy</p>
                                    <p className="text-[10px] leading-relaxed mt-1">
                                        Abuse of the referral system using bots or multiple accounts will result in immediate account termination.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Referral;
