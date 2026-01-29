import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MaintenanceMode = ({ maintenanceUntil }) => {
    const { logout } = useAuth();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!maintenanceUntil) return;

            const targetDate = new Date(maintenanceUntil);
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
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [maintenanceUntil]);

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4">
            <main className="max-w-2xl w-full flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden bg-white dark:bg-slate-900 border-2 border-amber-100 dark:border-amber-900/30 p-8 sm:p-12 rounded-[3rem] shadow-2xl shadow-amber-500/10 text-center w-full"
                >
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl text-amber-600 mb-8 inline-block animate-pulse">
                        <Shield className="w-16 h-16" />
                    </div>

                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
                        Attendly is <span className="text-amber-600">Updating</span>
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                        We are currently performing scheduled maintenance to improve your experience.
                        We'll be back online very soon!
                    </p>

                    {maintenanceUntil && (
                        <div className="grid grid-cols-4 gap-3 sm:gap-6 mb-10">
                            {[
                                { label: 'Days', value: timeLeft.days },
                                { label: 'Hours', value: timeLeft.hours },
                                { label: 'Mins', value: timeLeft.minutes },
                                { label: 'Secs', value: timeLeft.seconds }
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col items-center gap-2">
                                    <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                                        <span className="text-2xl sm:text-3xl font-black tabular-nums">{String(value).padStart(2, '0')}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Maintenance Mode Active</span>
                        </div>

                        <button
                            onClick={logout}
                            className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors opacity-60 hover:opacity-100"
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-amber-600/10 rounded-full blur-[80px] pointer-events-none" />
                </motion.div>
            </main>
        </div>
    );
};

export default MaintenanceMode;
