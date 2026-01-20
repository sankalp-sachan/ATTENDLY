import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('attendly_current_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Clean up local mock users since we are now connected to backend
    useEffect(() => {
        localStorage.removeItem('attendly_users');
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('attendly_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('attendly_current_user');
        }
    }, [user]);

    const register = async (email, password, name, institute) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'https://attendly-backend-pe5k.onrender.com/api/users',
                { email, password, name, institute },
                config
            );

            // If token is present, auto-login (legacy or if verification disabled)
            if (data.token) {
                setUser(data);
                return { success: true, data };
            } else {
                // Verification required
                return { success: true, requiresVerification: true, email: data.email, message: data.message };
            }
        } catch (error) {
            console.error("Registration error:", error);
            const serverError = error.response?.data?.error;
            const message = error.response?.data?.message || 'Registration failed';

            // Append explicit server error details if available
            throw new Error(serverError ? `${message}: ${serverError}` : message);
        }
    };



    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'https://attendly-backend-pe5k.onrender.com/api/users/login',
                { email, password },
                config
            );

            setUser(data);
            return data;
        } catch (error) {
            // Check if error is due to unverified account
            if (error.response?.status === 401 && error.response?.data?.isUnverified) {
                const err = new Error(error.response.data.message);
                err.isUnverified = true;
                err.email = error.response.data.email;
                throw err;
            }
            throw new Error(error.response?.data?.message || 'Invalid email or password');
        }
    };

    const googleLogin = async (credential) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'https://attendly-backend-pe5k.onrender.com/api/users/google-auth',
                { token: credential },
                config
            );

            setUser(data);
            return data;
        } catch (error) {
            console.error("Google Login error:", error);
            throw new Error(error.response?.data?.message || 'Google Login failed');
        }
    };

    const deleteUser = async (userId) => {
        // Placeholder: Backend does not currently support user deletion via API
        console.warn("deleteUser not implemented on backend endpoints yet.");
        // If you have a backend route, you would call: await axios.delete(`/api/users/${userId}`);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('attendly_current_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};
