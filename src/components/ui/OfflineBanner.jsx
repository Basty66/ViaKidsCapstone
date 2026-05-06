import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineBanner = () => {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500/90 backdrop-blur-sm text-slate-900 px-4 py-2 flex items-center justify-center gap-2 text-sm font-bold animate-[slideDown_0.3s_ease-out]">
            <WifiOff size={16} />
            <span>Sin conexión a Internet — Algunas funciones pueden no estar disponibles</span>
        </div>
    );
};
