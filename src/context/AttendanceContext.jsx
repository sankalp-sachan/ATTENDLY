import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`attendance_classes_${user.id}`);
            setClasses(saved ? JSON.parse(saved) : []);
        } else {
            setClasses([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`attendance_classes_${user.id}`, JSON.stringify(classes));
        }
    }, [classes, user]);

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

    useEffect(() => {
        localStorage.setItem('attendance_classes', JSON.stringify(classes));
    }, [classes]);

    useEffect(() => {
        localStorage.setItem('dark_mode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const addClass = (newClass) => {
        const classWithId = {
            ...newClass,
            id: Date.now().toString(),
            attendance: {},
            targetPercentage: newClass.targetPercentage || 75
        };
        setClasses(prev => [...prev, classWithId]);
    };

    const removeClass = (id) => {
        setClasses(prev => prev.filter(c => c.id !== id));
    };

    const updateAttendance = (classId, date, status) => {
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
    };

    const updateClass = (classId, updates) => {
        setClasses(prev => prev.map(c =>
            c.id === classId ? { ...c, ...updates } : c
        ));
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

    const sendNotification = (title, message) => {
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/pwa-192x192.png'
            });
        }
    };

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
