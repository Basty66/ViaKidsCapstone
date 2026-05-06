import { useState, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export const Select = ({ label, value, onChange, options, placeholder = 'Seleccionar...', icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="relative" ref={ref}>
            {label && <label className="text-xs text-slate-400 ml-1 mb-1 block">{label}</label>}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none flex items-center justify-between gap-2 text-sm hover:border-white/20 transition-colors"
            >
                <span className={selectedOption ? 'text-white' : 'text-slate-500'}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                        {options.length > 5 && (
                            <div className="p-2 border-b border-white/10">
                                <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                                    <Search size={14} className="text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="bg-transparent outline-none text-white text-sm flex-1"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="max-h-48 overflow-y-auto">
                            {filtered.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => { onChange(option.value); setIsOpen(false); setSearch(''); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${option.value === value ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-white/5'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
