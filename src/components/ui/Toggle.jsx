export const Toggle = ({ enabled, onChange, label, size = 'md' }) => {
    const sizes = {
        sm: { track: 'w-9 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-4' },
        md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
        lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
    };
    const s = sizes[size];

    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
                <div className={`block ${s.track} rounded-full transition-colors duration-200 ${enabled ? 'bg-blue-600' : 'bg-slate-600'}`} />
                <div className={`absolute left-0.5 top-0.5 ${s.thumb} rounded-full bg-white shadow transition-transform duration-200 ${enabled ? s.translate : 'translate-x-0'}`} />
            </div>
            {label && <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>}
        </label>
    );
};
