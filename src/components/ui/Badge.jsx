export const Badge = ({ children, status }) => {
    const getStyles = () => {
        switch (status) {
            case 'Activo':
            case 'En Ruta':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Mantenimiento':
            case 'Fuera de Servicio':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStyles()}`}>
            {children}
        </span>
    );
};