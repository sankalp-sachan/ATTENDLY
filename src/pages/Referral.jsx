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
                // Using a flat timestamp for broad mobile browser compatibility
                const targetTime = 1738643400000; // 2026-02-04T04:30:00.000Z in ms
                const now = new Date().getTime();
                const difference = targetTime - now;

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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/30 p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-red-500/10 group w-full max-w-lg mb-20"
                >
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl text-red-600 mb-6 animate-pulse">
                            <AlertCircle className="w-10 h-10" />
                        </div>

                        <div className="space-y-3 mb-8">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Referral Service <span className="text-red-600">Paused</span>
                            </h3>
                            <p className="text-base text-slate-500 dark:text-slate-400 font-medium px-2">
                                We are currently experiencing technical difficulties. The referral program will be back on <span className="font-bold text-slate-900 dark:text-white underline decoration-red-500 underline-offset-4">4 February 2026, 10:00 AM IST</span>.
                            </p>
                        </div>

                        {/* Timer Grid */}
                        <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full px-2">
                            {timerData.map(({ label, value }) => (
                                <div key={label} className="flex flex-col items-center">
                                    <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                                        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                                            {String(value).padStart(2, '0')}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 pointer-events-none" />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mt-2 tracking-widest">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/10 rounded-full border border-red-100 dark:border-red-900/20">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="text-[10px] sm:text-[11px] font-black text-red-600 uppercase tracking-widest">System Maintenance</span>
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
