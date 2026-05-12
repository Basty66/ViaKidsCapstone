export const StatCard = ({ label, value, icon, color = 'text-white', bg = 'bg-slate-500/20', trend, subtitle, onClick }) => {
    const Card = (
        <div className={`bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl backdrop-blur-md transition-all duration-300 relative overflow-hidden group ${onClick ? 'hover:bg-white/10 cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5 active:scale-[0.98]' : 'card-hover'}`}>
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-line" />

            {/* Subtle glow on hover */}
            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${bg}`} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider font-bold">{label}</p>
                    <h2 className={`text-3xl font-bold mt-2 ${color} transition-transform duration-300 group-hover:scale-105 origin-left`}>{value}</h2>
                    {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-xl ${bg} shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>{icon}</div>
            </div>
            {trend && (
                <div className={`mt-3 text-xs font-bold flex items-center gap-1 ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trend.up ? '↑' : '↓'} {trend.value}
                    <span className="text-slate-500 font-normal">vs ayer</span>
                </div>
            )}
        </div>
    );
    return onClick
        ? <button onClick={onClick} type="button" className="w-full text-left">{Card}</button>
        : Card;
};
