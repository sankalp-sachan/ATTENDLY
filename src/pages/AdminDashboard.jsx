import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Trash2, Mail, User as UserIcon, LogOut, GraduationCap, ChevronLeft, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { users, user, logout, deleteUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Guard: Only allow admin role
    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold dark:text-white mb-2">Access Denied</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">You do not have administrative privileges.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">Go to Home</button>
                </div>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete user "${name}"? This will erase all their attendance data.`)) {
            try {
                deleteUser(id);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full glass border-b dark:border-slate-800 px-4 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                            <ChevronLeft className="w-6 h-6 dark:text-slate-400" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Shield className="w-8 h-8 text-primary-600" />
                            <h1 className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                ADMIN PANEL
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2 px-3"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold hidden sm:block">Log Out</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black dark:text-white mb-2">User Management</h2>
                        <p className="text-slate-500 dark:text-slate-400">Manage all registered users and their data.</p>
                    </div>

                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white shadow-sm"
                        />
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card text-center p-8">
                        <Users className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                        <p className="text-3xl font-black dark:text-white">{users.length}</p>
                        <p className="text-sm font-bold text-slate-500 uppercase">Total Users</p>
                    </div>
                    <div className="card text-center p-8 border-primary-500/20 bg-primary-500/5">
                        <Shield className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                        <p className="text-3xl font-black dark:text-white">1</p>
                        <p className="text-sm font-bold text-slate-500 uppercase">Administrators</p>
                    </div>
                </div>

                {/* Users List */}
                <div className="card p-0 overflow-hidden">
                    <div className="grid grid-cols-1 divide-y dark:divide-slate-800">
                        {filteredUsers.map((u) => (
                            <motion.div
                                layout
                                key={u.id}
                                className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold dark:text-white text-lg">{u.name}</h4>
                                            {u.role === 'admin' && (
                                                <span className="px-2 py-0.5 bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase rounded-md border border-primary-500/20">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <Mail className="w-3.5 h-3.5" />
                                            {u.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {u.role !== 'admin' && (
                                        <button
                                            onClick={() => handleDelete(u.id, u.name)}
                                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <div className="p-12 text-center">
                                <Search className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400 font-medium">No users found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
