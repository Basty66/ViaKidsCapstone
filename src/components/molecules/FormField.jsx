import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export const FormField = ({ label, type = "text", placeholder, register, name, error, isPassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1 mb-5 group">
            <label className="text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600">
                {label}
            </label>
            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-offset-0 transition-all duration-300
            ${error ? 'border-red-400 focus:ring-red-100' : 'border-gray-300/50 hover:bg-white/70 focus:ring-blue-100 focus:border-blue-500'}`}
                    {...(register ? register(name) : {})}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && <span className="text-red-500 text-xs font-medium animate-pulse">{error.message}</span>}
        </div>
    );
};