import { useState, useEffect, useCallback } from 'react';
import { createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, progress: 100 }]);

        if (duration > 0) {
            const interval = setInterval(() => {
                setToasts(prev => prev.map(t => t.id === id ? { ...t, progress: t.progress - (100 / (duration / 50)) } : t));
            }, 50);

            setTimeout(() => {
                clearInterval(interval);
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
    const error = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
    const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);
    const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-[calc(100vw-2rem)] sm:max-w-sm">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto animate-[slideInRight_0.3s_ease-out] backdrop-blur-2xl rounded-2xl border shadow-2xl overflow-hidden"
                        style={{
                            background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : toast.type === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            borderColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : toast.type === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)',
                        }}
                    >
                        <div className="p-4 flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                                {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-400" />}
                                {toast.type === 'error' && <AlertCircle size={20} className="text-red-400" />}
                                {toast.type === 'warning' && <AlertTriangle size={20} className="text-amber-400" />}
                                {toast.type === 'info' && <Info size={20} className="text-blue-400" />}
                            </div>
                            <p className="text-white text-sm font-medium flex-1">{toast.message}</p>
                            <button onClick={() => removeToast(toast.id)} className="shrink-0 text-white/50 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="h-0.5 bg-white/10">
                            <div className="h-full transition-all duration-50 ease-linear rounded-full" style={{
                                width: `${toast.progress}%`,
                                background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#3b82f6',
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
