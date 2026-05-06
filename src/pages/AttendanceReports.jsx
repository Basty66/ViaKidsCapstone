import { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Users, TrendingUp, CheckCircle, Clock, Bus, MapPin } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { useToast } from '../context/ToastContext';

const chartData = [
    { dia: 'Lun', presentes: 120, ausentes: 5 },
    { dia: 'Mar', presentes: 118, ausentes: 7 },
    { dia: 'Mié', presentes: 125, ausentes: 0 },
    { dia: 'Jue', presentes: 122, ausentes: 3 },
    { dia: 'Vie', presentes: 115, ausentes: 10 },
];

const pieData = [
    { name: 'Presentes', value: 590, color: '#10b981' },
    { name: 'Ausentes', value: 25, color: '#ef4444' },
    { name: 'Tardanza', value: 12, color: '#f59e0b' },
];

const logs = [
    { id: 1, fecha: '06-05-2026', hora: '07:15', estudiante: 'Martina Rojas', ruta: 'Ruta Norte', bus: 'AB-1234', estado: 'Abordó' },
    { id: 2, fecha: '06-05-2026', hora: '07:18', estudiante: 'Lucas Pérez', ruta: 'Ruta Norte', bus: 'AB-1234', estado: 'Abordó' },
    { id: 3, fecha: '06-05-2026', hora: '07:22', estudiante: 'Sofía Gómez', ruta: 'Ruta Sur', bus: 'XY-9876', estado: 'Ausente' },
    { id: 4, fecha: '06-05-2026', hora: '16:05', estudiante: 'Martina Rojas', ruta: 'Ruta Norte', bus: 'AB-1234', estado: 'Entregado' },
    { id: 5, fecha: '06-05-2026', hora: '16:10', estudiante: 'Lucas Pérez', ruta: 'Ruta Norte', bus: 'AB-1234', estado: 'Entregado' },
];

export const AttendanceReports = () => {
    const toast = useToast();

    const handleExportCSV = () => {
        const headers = 'Fecha,Hora,Estudiante,Ruta,Bus,Estado\n';
        const csvContent = headers + logs.map(l => `${l.fecha},${l.hora},${l.estudiante},${l.ruta},${l.bus},${l.estado}`).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_asistencia_${new Date().toLocaleDateString()}.csv`;
        a.click();
        toast.success('Reporte CSV descargado');
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass p-6 md:p-8 rounded-3xl gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3"><TrendingUp className="text-blue-400" /> Reportes de Asistencia</h1>
                        <p className="text-slate-400 text-sm mt-1">Auditoría y estadísticas de abordaje</p>
                    </div>
                    <button onClick={handleExportCSV} className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10 btn-ripple">
                        <Download size={18} /> Exportar CSV
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
                    <StatCard label="Promedio Diario" value="120" icon={<Users size={20} />} color="text-blue-400" bg="bg-blue-500/20" subtitle="alumnos" />
                    <StatCard label="Asistencia" value="96%" icon={<CheckCircle size={20} />} color="text-emerald-400" bg="bg-emerald-500/20" trend={{ up: true, value: '+2%' }} />
                    <StatCard label="Puntualidad" value="92%" icon={<Clock size={20} />} color="text-amber-400" bg="bg-amber-500/20" subtitle="en tiempo" />
                    <StatCard label="Rutas Activas" value="4" icon={<Bus size={20} />} color="text-purple-400" bg="bg-purple-500/20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-3xl lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-lg font-bold text-white mb-6">Asistencia Semanal</h2>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="dia" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                    <Bar dataKey="presentes" name="Presentes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="ausentes" name="Ausentes" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <h2 className="text-lg font-bold text-white mb-6">Distribución</h2>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                                        {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-2">
                            {pieData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: item.color }} /> <span className="text-slate-300">{item.name}</span></div>
                                    <span className="text-white font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    {['Fecha/Hora', 'Estudiante', 'Ruta/Bus', 'Estado'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((row, i) => (
                                    <tr key={row.id} className="hover:bg-white/5 transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <td className="px-4 py-3 text-sm text-slate-300">{row.fecha} <span className="text-slate-500">— {row.hora}</span></td>
                                        <td className="px-4 py-3 text-sm text-white font-medium">{row.estudiante}</td>
                                        <td className="px-4 py-3 text-sm text-slate-400">{row.ruta} <br /><span className="text-xs text-blue-400">{row.bus}</span></td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.estado === 'Abordó' ? 'bg-blue-500/20 text-blue-400' : row.estado === 'Entregado' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {row.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
