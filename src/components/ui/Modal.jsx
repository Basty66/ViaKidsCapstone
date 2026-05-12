import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

let modalCount = 0;

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const wasOpen = useRef(false);

    useEffect(() => {
        if (isOpen && !wasOpen.current) {
            wasOpen.current = true;
            modalCount++;
            document.body.style.overflow = 'hidden';
        } else if (!isOpen && wasOpen.current) {
            wasOpen.current = false;
            modalCount--;
            if (modalCount <= 0) document.body.style.overflow = '';
        }
        return () => {
            if (wasOpen.current) {
                wasOpen.current = false;
                modalCount--;
                if (modalCount <= 0) document.body.style.overflow = '';
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={onClose} />
            <div className={`relative w-full ${sizes[size]} bg-slate-900/95 backdrop-blur-2xl border border-white/10 sm:rounded-3xl shadow-2xl animate-[scaleIn_0.3s_ease-out] max-h-full sm:max-h-[90vh] overflow-y-auto max-sm:inset-0 max-sm:h-full max-sm:max-w-full max-sm:border-0 max-sm:rounded-none`}>
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl z-10 flex justify-between items-center p-4 sm:p-6 pb-4 border-b border-white/5">
                    <h2 className="text-base sm:text-xl font-bold text-white truncate">{title}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all shrink-0" aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 sm:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
