import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, AlertCircle, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Referral = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            try {
                // Target: 4th February 2026, 10:00 AM IST (UTC+5:30)
                const targetDate = new Date('2026-02-04T10:00:00+05:30');
                const now = new Date();
                const difference = targetDate.getTime() - now.getTime();

                if (difference > 0) {
                    setTimeLeft({
                        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                        minutes: Math.floor((difference / 1000 / 60) % 60),
                        seconds: Math.floor((difference / 1000) % 60)
                    });
                } else {
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                }
            } catch (err) {
                console.error("Timer calculation error:", err);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    const timerData = [
        { label: 'Days', value: timeLeft?.days ?? 0 },
        { label: 'Hours', value: timeLeft?.hours ?? 0 },
        { label: 'Mins', value: timeLeft?.minutes ?? 0 },
        { label: 'Secs', value: timeLeft?.seconds ?? 0 }
    ];

    return (
        <div className="fixed inset-0 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b dark:border-slate-800 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tight">Refer & Earn</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
                {/* Service Down Alert */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/30 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-red-500/10 group w-full max-w-lg mb-10"
                >
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl text-red-600 mb-8 animate-pulse shadow-inner">
                            <AlertCircle className="w-12 h-12" />
                        </div>

                        <div className="space-y-4 mb-10">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                                REFERRAL <span className="text-red-600">PAUSED</span>
                            </h3>
                            <p className="text-base text-slate-500 dark:text-slate-400 font-medium px-2 leading-relaxed">
                                We are currently experiencing technical difficulties. The referral program will be back on <span className="font-bold text-slate-900 dark:text-white underline decoration-red-500 decoration-2 underline-offset-4">4 February 2026, 10:00 AM IST</span>.
                            </p>
                        </div>

                        {/* Timer Grid */}
                        <div className="grid grid-cols-4 gap-3 sm:gap-5 w-full px-2">
                            {timerData.map(({ label, value }) => (
                                <div key={label} className="flex flex-col items-center">
                                    <div className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center border-2 border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums drop-shadow-md">
                                            {String(value).padStart(2, '0')}
                                        </span>
                                        {/* Glass shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                                        <div className="absolute top-0 inset-x-0 h-px bg-white/20 dark:bg-white/5" />
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 mt-3 tracking-widest">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex items-center gap-2.5 px-6 py-3 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 shadow-sm">
                            <Clock className="w-5 h-5 text-red-600 animate-spin-slow" />
                            <span className="text-[11px] sm:text-[12px] font-black text-red-600 uppercase tracking-widest">SYSTEM MAINTENANCE</span>
                        </div>
                    </div>

                    {/* Decorative background blurs - enhanced */}
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-60 h-60 bg-red-600/15 rounded-full blur-[80px] pointer-events-none" />
                </motion.div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}} />
        </div>
    );
};

export default Referral;
