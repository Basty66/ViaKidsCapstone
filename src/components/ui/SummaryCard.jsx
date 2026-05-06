export const SummaryCard = ({ title, value, icon, color }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                {icon}
            </div>
        </div>
    </div>
);