import { useState } from 'react';
import { Search } from 'lucide-react';

export const DataTable = ({ title, columns, data, actions }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Filtra los datos basándose en el término de búsqueda
    const filteredData = data.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Calculamos el colspan dinámico para el mensaje de "no resultados"
    const totalColumns = columns.length + (actions ? 1 : 0);

    return (
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl w-full">
            {/* Header con Buscador */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                            {columns.map((col, i) => (
                                <th key={i} className="pb-4 px-2 font-semibold whitespace-nowrap">{col.header}</th>
                            ))}
                            {actions && <th className="pb-4 px-2 font-semibold text-right">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="text-white">
                        {filteredData.length > 0 ? (
                            filteredData.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    {columns.map((col, j) => (
                                        <td key={j} className="py-4 px-2 text-sm">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="py-4 px-2 text-right">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={totalColumns} className="py-12 text-center text-slate-500 italic">
                                    No se encontraron resultados para tu búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};