import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Trash2, Mail, User as UserIcon, LogOut, ChevronLeft, Search, UserCog, BarChart2, Calendar, AlertCircle, ShieldCheck, PlusSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { useSystem } from '../context/SystemContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import TermsContent from '../components/TermsContent';
import { calculateAttendanceStats, getStatusColor } from '../utils/calculations';

const AdminDashboard = () => {
    const { users, user, logout, deleteUser, updateUserRole, fetchUsers } = useAuth();
    const { getUserAttendance } = useAttendance();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userAttendance, setUserAttendance] = useState([]);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verifyPassword, setVerifyPassword] = useState('');
    const [pendingAction, setPendingAction] = useState(null);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [loadingAttendance, setLoadingAttendance] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'assistant-admin') {
            fetchUsers();
        }
    }, [user, fetchUsers]);

    // Guard: Only allow admin or assistant-admin role
    if (user?.role !== 'admin' && user?.role !== 'assistant-admin') {
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

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        if (!pendingAction) return;

        try {
            if (pendingAction.type === 'delete') {
                await deleteUser(pendingAction.id, verifyPassword);
            } else if (pendingAction.type === 'role') {
                await updateUserRole(pendingAction.id, pendingAction.role, verifyPassword);
            }
            setIsVerifyModalOpen(false);
            setVerifyPassword('');
            setPendingAction(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = (id, name) => {
        setPendingAction({ type: 'delete', id, name, message: `delete user "${name}"` });
        setIsVerifyModalOpen(true);
    };

    const handleToggleRole = (u) => {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        setPendingAction({ type: 'role', id: u._id, role: newRole, name: u.name, message: `change ${u.name}'s role to ${newRole.toUpperCase()}` });
        setIsVerifyModalOpen(true);
    };

    const handleToggleAssistant = (u) => {
        const newRole = u.role === 'assistant-admin' ? 'user' : 'assistant-admin';
        const actionDesc = u.role === 'assistant-admin' ? 'remove assistant privileges from' : 'make assistant admin';
        setPendingAction({ type: 'role', id: u._id, role: newRole, name: u.name, message: `${actionDesc} ${u.name}` });
        setIsVerifyModalOpen(true);
    };

    const handleViewAttendance = async (u) => {
        setSelectedUser(u);
        setLoadingAttendance(true);
        setIsAttendanceModalOpen(true);
        try {
            const data = await getUserAttendance(u._id);
            setUserAttendance(data);
        } catch (err) {
            alert("Failed to fetch attendance data.");
        } finally {
            setLoadingAttendance(false);
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
                            <h1 className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent text-nowrap">
                                {user?.role === 'admin' ? 'ADMIN PANEL' : 'ASSISTANT PANEL'}
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2 px-3"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold hidden sm:block text-nowrap">Log Out</span>
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
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* Stats Summary & System Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card text-center p-8">
                        <Users className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                        <p className="text-3xl font-black dark:text-white">{users.length}</p>
                        <p className="text-sm font-bold text-slate-500 uppercase">Total Users</p>
                    </div>
                    <div className="card text-center p-8 border-primary-500/20 bg-primary-500/5">
                        <Shield className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                        <p className="text-3xl font-black dark:text-white">
                            {users.filter(u => u.role === 'admin').length}
                        </p>
                        <p className="text-sm font-bold text-slate-500 uppercase">
                            {user?.role === 'admin' ? 'Administrators' : 'Access Level'}
                        </p>
                    </div>

                    {user?.role === 'admin' && (
                        <MaintenanceControl />
                    )}
                </div>

                {/* Users List */}
                <div className="card p-0 overflow-hidden">
                    <div className="grid grid-cols-1 divide-y dark:divide-slate-800">
                        {filteredUsers.map((u) => (
                            <motion.div
                                layout
                                key={u._id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors gap-4"
                            >
                                <div
                                    className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                                    onClick={() => handleViewAttendance(u)}
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold dark:text-white text-lg truncate max-w-[150px] sm:max-w-none">{u.name}</h4>
                                            {u.role === 'admin' && (
                                                <span className="px-2 py-0.5 bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase rounded-md border border-primary-500/20">
                                                    Admin
                                                </span>
                                            )}
                                            {u.role === 'assistant-admin' && (
                                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-md border border-amber-500/20">
                                                    Assistant
                                                </span>
                                            )}
                                            {u.acceptedTerms ? (
                                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-md border border-green-500/20">
                                                    Terms Accepted
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-md border border-red-500/20">
                                                    Terms Pending
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 truncate">
                                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span className="truncate">{u.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 justify-end sm:justify-start">
                                    <button
                                        onClick={() => handleViewAttendance(u)}
                                        className="p-3 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-all"
                                        title="View Attendance"
                                    >
                                        <BarChart2 className="w-5 h-5" />
                                    </button>
                                    {user?.role === 'admin' && u.email !== user.email && (
                                        <>
                                            <button
                                                onClick={() => handleToggleAssistant(u)}
                                                className={`p-3 rounded-xl transition-all flex items-center gap-2 ${u.role === 'assistant-admin'
                                                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-500/10'
                                                    : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                                    }`}
                                                title={u.role === 'assistant-admin' ? "Remove Assistant Admin" : "Make Assistant Admin"}
                                            >
                                                <ShieldCheck className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleRole(u)}
                                                className={`p-3 rounded-xl transition-all flex items-center gap-2 ${u.role === 'admin'
                                                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10'
                                                    : 'text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10'
                                                    }`}
                                                title={u.role === 'admin' ? "Remove Admin Access" : "Grant Admin Access"}
                                            >
                                                <UserCog className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u._id, u.name)}
                                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </>
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

                {/* Dashboard Disclaimer */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-2xl mx-auto leading-relaxed italic">
                        Disclaimer: This application is not authorized, endorsed, or affiliated with any college or educational authority.
                        It is a personal utility designed for loyalty and individual attendance tracking.
                        The developer is not responsible for any discrepancies.
                        {" "}<button onClick={() => setIsTermsModalOpen(true)} className="underline hover:text-primary-500 transition-colors">View Terms & Conditions</button>
                    </p>
                </div>
            </main>

            {/* Attendance Modal */}
            <Modal
                isOpen={isAttendanceModalOpen}
                onClose={() => setIsAttendanceModalOpen(false)}
                title={selectedUser ? `${selectedUser.name}'s Attendance` : 'User Attendance'}
            >
                {loadingAttendance ? (
                    <div className="py-12 text-center text-slate-500">
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="font-bold">Fetching attendance data...</p>
                    </div>
                ) : userAttendance.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">No classes found for this user.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {userAttendance.map((c) => {
                            const stats = calculateAttendanceStats(c);
                            return (
                                <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h5 className="font-black dark:text-white text-lg">{c.name}</h5>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Started: {new Date(c.startDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-black ${getStatusColor(stats.percentage, c.targetPercentage)}`}>
                                            {stats.percentage}%
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Present</p>
                                            <p className="text-lg font-black text-green-500">{stats.presentCount}</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Absent</p>
                                            <p className="text-lg font-black text-red-500">{stats.absentCount}</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                                            <p className="text-lg font-black dark:text-white">{stats.totalWorkingDays}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 transition-all duration-500"
                                            style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 text-[10px] text-slate-500 text-center font-bold">
                                        Target: {c.targetPercentage}%
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal>

            {/* Password Verification Modal */}
            <Modal
                isOpen={isVerifyModalOpen}
                onClose={() => {
                    setIsVerifyModalOpen(false);
                    setVerifyPassword('');
                    setPendingAction(null);
                }}
                title="Verify Administrative Access"
            >
                <form onSubmit={handleActionSubmit} className="space-y-6">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-bold">
                            You are about to {pendingAction?.message}. This action requires confirmation.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                            Admin Password
                        </label>
                        <input
                            type="password"
                            required
                            autoFocus
                            placeholder="••••••••"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsVerifyModalOpen(false);
                                setVerifyPassword('');
                                setPendingAction(null);
                            }}
                            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20"
                        >
                            Confirm Action
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Terms Modal */}
            <Modal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                title="Terms & Conditions"
                footer={
                    <button
                        onClick={() => setIsTermsModalOpen(false)}
                        className="w-full btn-primary py-4"
                    >
                        Close
                    </button>
                }
            >
                <div className="text-[12px] opacity-90">
                    <TermsContent />
                </div>
            </Modal>
        </div>
    );
};

const MaintenanceControl = () => {
    const { maintenanceMode, maintenanceUntil, updateMaintenance } = useSystem();
    const [isUpdating, setIsUpdating] = useState(false);
    const [tempDate, setTempDate] = useState(maintenanceUntil ? new Date(maintenanceUntil).toISOString().slice(0, 16) : '');

    // Sync input when maintenanceUntil changes from server
    useEffect(() => {
        if (maintenanceUntil) {
            setTempDate(new Date(maintenanceUntil).toISOString().slice(0, 16));
        }
    }, [maintenanceUntil]);

    const handleToggle = async () => {
        setIsUpdating(true);
        try {
            const untilDate = tempDate ? new Date(tempDate).toISOString() : null;
            await updateMaintenance(!maintenanceMode, untilDate);
        } catch (err) {
            alert(err);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="card lg:col-span-2 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
                <div className={`p-3 rounded-2xl ${maintenanceMode ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-black dark:text-white text-lg leading-tight uppercase tracking-tight">Maintenance Mode</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {maintenanceMode ? 'Mode is ACTIVE' : 'Mode is INACTIVE'}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto relative z-10">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">OFF After</label>
                    <input
                        type="datetime-local"
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                    />
                </div>
                <button
                    onClick={handleToggle}
                    disabled={isUpdating}
                    className={`px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg uppercase tracking-widest ${maintenanceMode
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                        }`}
                >
                    {isUpdating ? '...' : maintenanceMode ? 'Turn OFF' : 'Turn ON'}
                </button>
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>
    );
};

export default AdminDashboard;
