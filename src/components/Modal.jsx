import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, showClose = true, closeOnOutsideClick = true }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeOnOutsideClick ? onClose : undefined}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800 flex-shrink-0">
                            <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">{title}</h3>
                            {showClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <X className="w-6 h-6 dark:text-slate-400" />
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="p-6 pt-2 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
