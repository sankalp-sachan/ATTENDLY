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
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('attendly_current_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('attendly_users');
        const initialUsers = savedUsers ? JSON.parse(savedUsers) : [];

        // Ensure admin@attendly.com exists
        const adminEmail = 'admin@attendly.com';
        if (!initialUsers.find(u => u.email === adminEmail)) {
            initialUsers.push({
                id: 'admin-1',
                email: adminEmail,
                password: 'adminpassword',
                name: 'System Administrator',
                role: 'admin'
            });
        }
        return initialUsers;
    });

    useEffect(() => {
        localStorage.setItem('attendly_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('attendly_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('attendly_current_user');
        }
    }, [user]);

    const register = (email, password, name, institute) => {
        const exists = users.find(u => u.email === email);
        if (exists) {
            throw new Error('User with this email already exists');
        }
        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name,
            institute: institute || '',
            role: email === 'admin@attendly.com' ? 'admin' : 'user'
        };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
        return newUser;
    };

    const login = (email, password) => {
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) {
            throw new Error('Invalid email or password');
        }
        setUser(found);
        return found;
    };

    const deleteUser = (userId) => {
        if (userId === 'admin-1') throw new Error("Cannot delete the system administrator");
        setUsers(prev => prev.filter(u => u.id !== userId));

        // Cleanup their data
        localStorage.removeItem(`attendance_classes_${userId}`);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, users, login, register, logout, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};
