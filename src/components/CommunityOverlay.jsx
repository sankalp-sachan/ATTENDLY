import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MessageCircle, ArrowRight, Bell } from 'lucide-react';

const CommunityOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the popup was shown recently (within last 3 hours)
        const lastShown = localStorage.getItem('community_popup_last_shown');
        const now = Date.now();
        const THREE_HOURS = 3 * 60 * 60 * 1000;

        if (lastShown && now - parseInt(lastShown) < THREE_HOURS) {
            return; // Don't show if shown within last 3 hours
        }

        // Show after a short delay once the site loads
        const timer = setTimeout(() => {
            setIsVisible(true);
            localStorage.setItem('community_popup_last_shown', Date.now().toString());
        }, 3000); // 3 seconds delay for better UX
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    const handleJoin = () => {
        window.open('https://whatsapp.com/channel/0029VbCXjXe35fLvh1izKn18', '_blank'); // Replace with actual link
        handleDismiss();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto border border-slate-100 dark:border-slate-800">
                            {/* Header Image/Pattern Area */}
                            <div className="relative h-32 bg-gradient-to-br from-primary-500 to-indigo-600 overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-200 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
                                </div>

                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-900">
                                        <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-inner">
                                            <MessageCircle className="w-8 h-8 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-10 pb-8 px-8 text-center">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Join Our Community
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8">
                                    Stay updated with the latest news, updates, and community discussions on our WhatsApp Broadcasting Channel.
                                </p>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleJoin}
                                        className="w-full flex items-center justify-between px-6 py-4 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-2xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/20 p-1.5 rounded-lg">
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <span>Join WhatsApp Channel</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={handleDismiss}
                                        className="w-full py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors text-sm"
                                    >
                                        Maybe later, I'll join afterwards
                                    </button>
                                </div>
                            </div>

                            {/* Stats/Footer */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-center gap-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <Users className="w-4 h-4 text-primary-500" />
                                    <span>500+ Members</span>
                                </div>
                                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Daily Updates</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommunityOverlay;
