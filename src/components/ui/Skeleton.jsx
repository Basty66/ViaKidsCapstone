export const Skeleton = () => (
    <div className="animate-pulse space-y-4 w-full">
        {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-2xl w-full"></div>
        ))}
    </div>
);