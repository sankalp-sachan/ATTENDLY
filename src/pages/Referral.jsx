import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Gift, Copy, Check, Share2, Info,
    ArrowRight, Trophy, Users, Star, QrCode, AlertCircle, Clock
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
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const targetDate = new Date('2026-02-04T00:00:00');
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft(null);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

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

            <main className="max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[80vh]">
                {/* Service Down Alert */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/30 p-8 rounded-[2.5rem] shadow-2xl shadow-red-500/10 group w-full"
                >
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl text-red-600 mb-6 animate-pulse">
                            <AlertCircle className="w-10 h-10" />
                        </div>

                        <div className="space-y-3 mb-8">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Referral Service <span className="text-red-600">Paused</span>
                            </h3>
                            <p className="text-base text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                                We are currently experiencing technical difficulties. The referral program will be back on <span className="font-bold text-slate-900 dark:text-white underline decoration-red-500 underline-offset-4">4 February 2026</span>.
                            </p>
                        </div>

                        {/* Timer Grid */}
                        <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
                            {[
                                { label: 'Days', value: timeLeft?.days },
                                { label: 'Hours', value: timeLeft?.hours },
                                { label: 'Mins', value: timeLeft?.minutes },
                                { label: 'Secs', value: timeLeft?.seconds }
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col items-center">
                                    <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 overflow-hidden group-hover:border-red-200 dark:group-hover:border-red-900/50 transition-all duration-300">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                                            {value !== undefined ? String(value).padStart(2, '0') : '00'}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 pointer-events-none" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mt-2 tracking-widest">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-red-50 dark:bg-red-900/10 rounded-full border border-red-100 dark:border-red-900/20">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">System Maintenance In Progress</span>
                        </div>
                    </div>

                    {/* Decorative background blur */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
                </motion.div>
            </main>
        </div>
    );
};

export default Referral;
