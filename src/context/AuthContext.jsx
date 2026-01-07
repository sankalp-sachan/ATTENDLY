import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('attendly_token'));
    const [loading, setLoading] = useState(true);
    // Users list for admin (would be fetched from API in full implementation)
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                // Ideally verify token with backend /me endpoint here
                // For now, we decode or just trust it until 401
                // Let's implement a simple user restore from localStorage if available 
                try {
                    const savedUser = localStorage.getItem('attendly_current_user');
                    if (savedUser) setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error('Failed to parse user', e);
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const register = async (email, password, name, institute) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, institute })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');

        return { success: true, code: data.code };
    };

    const login = async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.message || 'Login failed');
            if (data.code === 'UNVERIFIED') error.code = 'UNVERIFIED';
            throw error;
        }

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('attendly_token', data.token);
        localStorage.setItem('attendly_current_user', JSON.stringify(data.user));
        return data.user;
    };

    const verifyEmail = async (email, code) => {
        const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: code })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Verification failed');

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('attendly_token', data.token);
        localStorage.setItem('attendly_current_user', JSON.stringify(data.user));
        return true;
    };

    const resendVerificationCode = async (email) => {
        const response = await fetch('/api/auth/resend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Resend failed');

        return { success: true, code: data.code };
    };

    const deleteUser = async (userId) => {
        // Implement API call for delete if backend supports it
        // For now, stub or local filter
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('attendly_token');
        localStorage.removeItem('attendly_current_user');
    };

    return (
        <AuthContext.Provider value={{ user, users, login, register, verifyEmail, resendVerificationCode, logout, deleteUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
