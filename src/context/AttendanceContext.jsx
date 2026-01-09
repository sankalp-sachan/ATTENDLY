import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { calculateAttendanceStats } from '../utils/calculations';
import api from '../utils/api';

const AttendanceContext = createContext();

export const useAttendance = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }
    return context;
};

export const AttendanceProvider = ({ children }) => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        // Force notifications to be enabled in app state for all users
        setNotificationsEnabled(true);
        localStorage.setItem('notifications_enabled', 'true');
    }, [user]);

    // Fetch Classes from Backend (Syncing)
    useEffect(() => {
        const fetchClasses = async () => {
            if (user) {
                try {
                    const { data } = await api.get('/attendance');
                    // Normalize _id to id for frontend compatibility
                    const formattedClasses = data.map(c => ({
                        ...c,
                        id: c._id || c.id
                    }));
                    setClasses(formattedClasses);
                } catch (error) {
                    console.error("Failed to sync attendance data:", error);
                }
            } else {
                setClasses([]);
            }
        };
        fetchClasses();
    }, [user]);

    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('dark_mode');
        return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const checkPermission = async () => {
            if ('Notification' in window) {
                if (Notification.permission === 'default') {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        setNotificationsEnabled(true);
                        localStorage.setItem('notifications_enabled', 'true');
                    }
                } else if (Notification.permission === 'granted') {
                    setNotificationsEnabled(true);
                    localStorage.setItem('notifications_enabled', 'true');
                } else {
                    setNotificationsEnabled(false);
                    localStorage.setItem('notifications_enabled', 'false');
                }
            }
        };
        checkPermission();
    }, []);

    // Scheduled Daily Notification (8 AM)
    useEffect(() => {
        const checkScheduledNotification = () => {
            if (!notificationsEnabled) return;

            const now = new Date();
            const hour = now.getHours();
            const todayStr = now.toISOString().split('T')[0];
            const lastNotified = localStorage.getItem('last_daily_notification');

            // Send notification if it's 8 AM or later and we haven't notified today
            if (hour >= 8 && lastNotified !== todayStr) {
                // Check for low attendance (below 75%)
                const hasLowAttendance = classes.some(c => {
                    const stats = calculateAttendanceStats(c);
                    return stats.percentage < (c.targetPercentage || 75);
                });

                let title = "Daily Reminder";
                let message = "";

                if (hasLowAttendance) {
                    title = "⚠️ ATTENDANCE ALERT";
                    message = "college chala jaa bhadve";
                } else {
                    const messages = [
                        "Time to join your class! 🎓",
                        "Don't miss your lectures today! 📚",
                        "Attendance matters! Mark yours now. ✅",
                        "Good morning! Ready for learning? ☀️",
                        "Keep your streak alive! Join class. 🔥",
                        "Your future self will thank you for attending! 🚀",
                        "Success occurs when opportunity meets preparation. 🌟",
                        "The beautiful thing about learning is that no one can take it away from you. 💡",
                        "Education is the passport to the future. 🌍",
                        "Develop a passion for learning. If you do, you will never cease to grow. 🌱"
                    ];
                    message = messages[Math.floor(Math.random() * messages.length)];
                }

                sendNotification(title, message);
                localStorage.setItem('last_daily_notification', todayStr);
            }

            // Evening Alarm Reminder (9 PM)
            const lastAlarmReminder = localStorage.getItem('last_alarm_reminder');
            if (hour >= 21 && lastAlarmReminder !== todayStr) {
                sendNotification("⏰ Set Your Alarm!", "Don't forget to set an alarm for tomorrow morning! Sleep well. 😴");
                localStorage.setItem('last_alarm_reminder', todayStr);
            }
        };

        // Check immediately on mount/update
        checkScheduledNotification();

        // Check every minute
        const interval = setInterval(checkScheduledNotification, 60000);
        return () => clearInterval(interval);
    }, [notificationsEnabled, classes]);

    useEffect(() => {
        localStorage.setItem('dark_mode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const addClass = async (newClass) => {
        try {
            const { data } = await api.post('/attendance', newClass);
            const formatted = { ...data, id: data._id || data.id };
            setClasses(prev => [...prev, formatted]);
        } catch (error) {
            console.error("Error adding class:", error);
            alert("Failed to create class. Please try again.");
        }
    };

    const removeClass = async (id) => {
        try {
            await api.delete(`/attendance/${id}`);
            setClasses(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error removing class:", error);
        }
    };

    const updateAttendance = async (classId, date, status) => {
        // Optimistic Update
        setClasses(prev => prev.map(c => {
            if (c.id === classId) {
                const newAttendance = { ...c.attendance };
                if (status === null) {
                    delete newAttendance[date];
                } else {
                    newAttendance[date] = status;
                }
                return { ...c, attendance: newAttendance };
            }
            return c;
        }));

        // Backend Update
        try {
            await api.put(`/attendance/${classId}/mark`, { date, status });
        } catch (error) {
            console.error("Error marking attendance:", error);
            // Revert state if necessary, but omitting for simplicity/UX speed
        }
    };

    const updateClass = async (classId, updates) => {
        // Optimistic Update
        setClasses(prev => prev.map(c =>
            c.id === classId ? { ...c, ...updates } : c
        ));

        // Backend Update
        try {
            await api.put(`/attendance/${classId}`, updates);
        } catch (error) {
            console.error("Error updating class:", error);
        }
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                localStorage.setItem('notifications_enabled', 'true');
                return true;
            }
        }
        return false;
    };

    const sendNotification = async (title, message) => {
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            try {
                // Try Service Worker first (Required for Android Chrome)
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    if (registration) {
                        return registration.showNotification(title, {
                            body: message,
                            icon: '/pwa-192x192.png'
                        });
                    }
                }

                // Fallback for Desktop if SW not ready/available
                new Notification(title, {
                    body: message,
                    icon: '/pwa-192x192.png'
                });
            } catch (error) {
                console.error("Failed to send notification:", error);
            }
        }
    };

    // Offline Notification Scheduling (Experimental)
    useEffect(() => {
        const scheduleOfflineNotification = async () => {
            if (!notificationsEnabled || !('serviceWorker' in navigator)) return;

            try {
                // Check for experimental TimestampTrigger support (Chrome Android/Desktop with flags)
                if (!('TimestampTrigger' in window)) return;

                const reg = await navigator.serviceWorker.ready;
                const now = new Date();
                let targetTime = new Date();
                targetTime.setHours(8, 0, 0, 0);

                // If already past 8 AM, schedule for tomorrow
                if (now >= targetTime) {
                    targetTime.setDate(targetTime.getDate() + 1);
                }

                // Determine message based on current stats
                const hasLowAttendance = classes.some(c => {
                    const stats = calculateAttendanceStats(c);
                    return stats.percentage < (c.targetPercentage || 75);
                });

                let title = "Daily Reminder";
                let body = "Don't forget to mark your attendance today!";

                if (hasLowAttendance) {
                    title = "⚠️ ATTENDANCE ALERT";
                    body = "college chala jaa bhadve";
                } else {
                    const messages = [
                        "Time to join your class! 🎓",
                        "Don't miss your lectures today! 📚",
                        "Attendance matters! Mark yours now. ✅",
                        "Good morning! Ready for learning? ☀️",
                        "Keep your streak alive! Join class. 🔥",
                        "Your future self will thank you for attending! 🚀",
                        "Success occurs when opportunity meets preparation. 🌟",
                        "The beautiful thing about learning is that no one can take it away from you. 💡",
                        "Education is the passport to the future. 🌍",
                        "Develop a passion for learning. If you do, you will never cease to grow. 🌱"
                    ];
                    body = messages[Math.floor(Math.random() * messages.length)];
                }

                // Schedule Morning Notification
                await reg.showNotification(title, {
                    body: body,
                    tag: 'daily-reminder', // Keeps only one pending notification
                    icon: '/pwa-192x192.png',
                    showTrigger: new window.TimestampTrigger(targetTime.getTime())
                });

                // Schedule Evening Alarm Reminder (9 PM)
                let eveningTime = new Date();
                eveningTime.setHours(21, 0, 0, 0);
                if (now >= eveningTime) {
                    eveningTime.setDate(eveningTime.getDate() + 1);
                }

                await reg.showNotification("⏰ Set Your Alarm!", {
                    body: "Don't forget to set an alarm for tomorrow morning! Sleep well. 😴",
                    tag: 'evening-alarm-reminder',
                    icon: '/pwa-192x192.png',
                    showTrigger: new window.TimestampTrigger(eveningTime.getTime())
                });

            } catch (error) {
                // Ignore unsupported API errors
            }
        };

        scheduleOfflineNotification();
    }, [classes, notificationsEnabled]);

    return (
        <AttendanceContext.Provider value={{
            classes,
            addClass,
            removeClass,
            updateAttendance,
            updateClass,
            darkMode,
            toggleDarkMode,
            notificationsEnabled,
            requestNotificationPermission,
            sendNotification
        }}>
            {children}
        </AttendanceContext.Provider>
    );
};
