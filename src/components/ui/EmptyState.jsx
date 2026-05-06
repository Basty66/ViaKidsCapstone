export const EmptyState = ({ icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
            <div className="bg-white/5 p-6 rounded-3xl mb-6 animate-float">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm max-w-xs mb-6">{description}</p>
            {action}
        </div>
    );
};
