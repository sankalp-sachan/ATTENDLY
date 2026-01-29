import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceUntil, setMaintenanceUntil] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/system/settings');
            setMaintenanceMode(data.maintenanceMode);
            setMaintenanceUntil(data.maintenanceUntil);
        } catch (error) {
            console.error('Error fetching system settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateMaintenance = async (mode, until) => {
        try {
            const { data } = await api.put(
                '/system/maintenance',
                { maintenanceMode: mode, maintenanceUntil: until }
            );
            setMaintenanceMode(data.maintenanceMode);
            setMaintenanceUntil(data.maintenanceUntil);
            return data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    };

    useEffect(() => {
        fetchSettings();
        // Poll every minute to check if maintenance ended
        const interval = setInterval(fetchSettings, 60000);
        return () => clearInterval(interval);
    }, []);

    const value = {
        maintenanceMode,
        maintenanceUntil,
        loading,
        updateMaintenance,
        fetchSettings,
        isAdmin: user?.role === 'admin'
    };

    return (
        <SystemContext.Provider value={value}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => useContext(SystemContext);
