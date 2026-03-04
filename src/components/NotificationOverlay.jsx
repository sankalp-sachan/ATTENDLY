import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Cookie, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../utils/api';

const VAPID_PUBLIC_KEY = 'BOyz_Vzommn5IeuSBnKqz_XMLQKGI-G3fJxTTG7Un7WdyTjH6t4kPmAQwZ10jWYR_8XzQ4BTtWZ89alQiT714PQ';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const NotificationOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const hasConsented = localStorage.getItem('app_notification_cookie_consent');
            const notificationPerm = 'Notification' in window ? Notification.permission : 'unsupported';

            // If they already granted permission but we haven't registered the SW, do it silently
            if (notificationPerm === 'granted') {
                registerAndSubscribe(false);
                return;
            }

            if (!hasConsented && notificationPerm === 'default') {
                const timer = setTimeout(() => {
                    setIsVisible(true);
                }, 4000);
                return () => clearTimeout(timer);
            }
        };

        checkStatus();
    }, []);

    const registerAndSubscribe = async (shouldShowAlert = true) => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            if (shouldShowAlert) alert('Push notifications not supported by your browser');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js');

            // Fix: Check for existing subscription and unsubscribe if key mismatch
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                await existingSubscription.unsubscribe();
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            const user = JSON.parse(localStorage.getItem('attendly_current_user'));
            if (user?.token) {
                await api.post('/notifications/subscribe', { subscription });
            }
        } catch (error) {
            console.error('Push Subscription Error:', error);
            if (error.name === 'InvalidStateError') {
                // If it still fails, it's likely a persistent key mismatch, 
                // but the manual unsubscribe above usually fixes it.
            }
        }
    };

    const handleDismiss = () => {
        localStorage.setItem('app_notification_cookie_consent', 'true');
        setIsVisible(false);
    };

    const handleAccept = async () => {
        if ('Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    await registerAndSubscribe();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        localStorage.setItem('app_notification_cookie_consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto border border-slate-100 dark:border-slate-800">
                            <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
                                </div>

                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-900">
                                        <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-inner">
                                            <Bell className="w-8 h-8 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 pb-8 px-8 text-center">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Allow Permissions
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                                    We use cookies to improve your experience. Also, allow notifications to receive important updates even when the app is closed.
                                </p>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleAccept}
                                        className="w-full flex items-center justify-between px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/20 p-1.5 rounded-lg">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <span>Allow Notifications & Cookies</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={handleDismiss}
                                        className="w-full py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors text-sm"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-center gap-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <Cookie className="w-4 h-4 text-orange-500" />
                                    <span>Cookie Policy</span>
                                </div>
                                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <Bell className="w-4 h-4 text-indigo-500" />
                                    <span>Background Alerts</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationOverlay;
