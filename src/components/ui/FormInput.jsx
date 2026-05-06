export const FormInput = ({ label, type = "text", placeholder, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
        />
    </div>
);