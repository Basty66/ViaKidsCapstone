import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Bus, Users, TrendingUp, Bell, MapPin, QrCode, AlertTriangle, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { useBuses } from '../hooks/useBuses';
import { useStudents } from '../hooks/useStudents';
import { attendanceService } from '../services/attendanceService';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const attendanceChartData = [
    { dia: 'Lun', presentes: 120, ausentes: 5 },
    { dia: 'Mar', presentes: 118, ausentes: 7 },
    { dia: 'Mié', presentes: 125, ausentes: 2 },
    { dia: 'Jue', presentes: 122, ausentes: 3 },
    { dia: 'Vie', presentes: 115, ausentes: 10 },
];

const routePerformanceData = [
    { name: 'Ruta Norte', puntualidad: 94, pasajeros: 38 },
    { name: 'Ruta Sur', puntualidad: 88, pasajeros: 32 },
    { name: 'Ruta Este', puntualidad: 91, pasajeros: 28 },
    { name: 'Ruta Oeste', puntualidad: 85, pasajeros: 35 },
];

export const AdminDashboard = () => {
    const { allBuses: buses } = useBuses();
    const { allStudents: students } = useStudents();
    const [attendanceSummary, setAttendanceSummary] = useState({ boarded: 0, disembarked: 0, absent: 0, total: 0 });
    const [notifications, setNotifications] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        attendanceService.getTodaySummary().then(setAttendanceSummary).catch(() => {});
        apiService.getNotifications().then(setNotifications).catch(() => {});
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const stats = useMemo(() => ({
        total: buses.length,
        enRuta: buses.filter(b => b.estado === 'En Ruta').length,
        enEspera: buses.filter(b => b.estado === 'En Espera').length,
        totalStudents: students.length,
    }), [buses, students]);

    const unreadNotifications = notifications.filter(n => !n.leido).length;

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass p-6 md:p-8 rounded-3xl gap-4 animate-fade-in-up relative overflow-hidden">
                    {/* Subtle background glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-[60px]" />

                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Buenos {currentTime.getHours() < 12 ? 'días' : currentTime.getHours() < 18 ? 'tardes' : 'noches'} 👋
                        </h1>
                        <p className="text-slate-400 mt-1">Resumen operativo de ViaKids</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2.5 rounded-xl text-sm font-semibold relative z-10">
                        <Clock size={16} />
                        {currentTime.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })}
                        <span className="text-blue-300">•</span>
                        {currentTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 stagger-children">
                    <StatCard label="Total Flota" value={stats.total} icon={<Bus size={22} />} color="text-white" bg="bg-slate-500/20" />
                    <StatCard label="En Ruta" value={stats.enRuta} icon={<MapPin size={22} />} color="text-emerald-400" bg="bg-emerald-500/20" trend={{ up: true, value: '+1' }} />
                    <StatCard label="Estudiantes" value={stats.totalStudents} icon={<Users size={22} />} color="text-blue-400" bg="bg-blue-500/20" />
                    <StatCard label="Abordaron Hoy" value={attendanceSummary.boarded} icon={<CheckCircle size={22} />} color="text-purple-400" bg="bg-purple-500/20" trend={{ up: true, value: '+5%' }} />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Attendance Chart */}
                    <div className="glass p-6 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart3 size={20} className="text-blue-400" /> Asistencia Semanal
                            </h2>
                            <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full">Esta semana</span>
                        </div>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={attendanceChartData}>
                                    <defs>
                                        <linearGradient id="colorPresentes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAusentes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="dia" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="presentes" name="Presentes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPresentes)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="ausentes" name="Ausentes" stroke="#ef4444" fillOpacity={1} fill="url(#colorAusentes)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Route Performance */}
                    <div className="glass p-6 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-emerald-400" /> Rendimiento de Rutas
                            </h2>
                        </div>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={routePerformanceData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="puntualidad" name="Puntualidad" fill="#10b981" radius={[0, 8, 8, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Attendance Summary + Fleet Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fleet Status */}
                    <div className="glass p-6 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Bus size={20} className="text-blue-400" /> Estado de la Flota
                        </h2>
                        <div className="space-y-3">
                            {buses.map((bus, i) => (
                        <div key={bus.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group hover:bg-slate-800/50" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${bus.estado === 'En Ruta' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    <Bus size={18} />
                                </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{bus.patente}</p>
                                            <p className="text-slate-400 text-xs">{bus.conductor}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${bus.estado === 'En Ruta' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {bus.estado}
                                        </span>
                                        {bus.estado === 'En Ruta' && (
                                            <p className="text-slate-500 text-xs mt-1">ETA: {bus.tiempoEstimado}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications + Attendance */}
                    <div className="space-y-6">
                        {/* Attendance Summary */}
                        <div className="glass p-6 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle size={20} className="text-emerald-400" /> Asistencia Hoy
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl text-center hover:bg-blue-500/15 transition-colors">
                                    <p className="text-3xl font-bold text-blue-400">{attendanceSummary.boarded}</p>
                                    <p className="text-slate-400 text-xs mt-1">Abordaron</p>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center hover:bg-emerald-500/15 transition-colors">
                                    <p className="text-3xl font-bold text-emerald-400">{attendanceSummary.disembarked}</p>
                                    <p className="text-slate-400 text-xs mt-1">Entregados</p>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center hover:bg-red-500/15 transition-colors">
                                    <p className="text-3xl font-bold text-red-400">{attendanceSummary.absent}</p>
                                    <p className="text-slate-400 text-xs mt-1">Ausentes</p>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl text-center hover:bg-purple-500/15 transition-colors">
                                    <p className="text-3xl font-bold text-purple-400">{attendanceSummary.total}</p>
                                    <p className="text-slate-400 text-xs mt-1">Registros</p>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="glass p-6 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Bell size={20} className="text-amber-400" /> Alertas
                                </h2>
                                {unreadNotifications > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce-subtle">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                {notifications.slice(0, 3).map((notif) => (
                                    <div key={notif.id} className={`p-3 rounded-xl border transition-all ${notif.leido ? 'bg-slate-900/30 border-white/5' : 'bg-blue-500/5 border-blue-500/20'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg shrink-0 ${notif.tipo === 'ALERTA' || notif.tipo === 'Alerta' ? 'bg-amber-500/20 text-amber-400' : notif.tipo === 'URGENTE' || notif.tipo === 'Urgente' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {notif.tipo === 'URGENTE' || notif.tipo === 'Urgente' ? <AlertTriangle size={14} /> : <Bell size={14} />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-white text-sm font-medium truncate">{notif.mensaje}</p>
                                                <p className="text-slate-500 text-xs mt-0.5">{notif.fecha} — {notif.ruta}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass p-6 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                    <h2 className="text-lg font-bold text-white mb-4">Accesos Rápidos</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[
                            { label: 'Estudiantes', icon: <Users size={20} />, path: '/admin/estudiantes', color: 'text-blue-400', bg: 'hover:bg-blue-500/10 border-blue-500/10' },
                            { label: 'Flota', icon: <Bus size={20} />, path: '/admin/flota', color: 'text-emerald-400', bg: 'hover:bg-emerald-500/10 border-emerald-500/10' },
                            { label: 'Tracking', icon: <MapPin size={20} />, path: '/admin/tracking', color: 'text-amber-400', bg: 'hover:bg-amber-500/10 border-amber-500/10' },
                            { label: 'QR Codes', icon: <QrCode size={20} />, path: '/admin/estudiantes/qr', color: 'text-purple-400', bg: 'hover:bg-purple-500/10 border-purple-500/10' },
                            { label: 'Rutas', icon: <MapPin size={20} />, path: '/admin/rutas', color: 'text-cyan-400', bg: 'hover:bg-cyan-500/10 border-cyan-500/10' },
                            { label: 'Reportes', icon: <TrendingUp size={20} />, path: '/admin/reportes', color: 'text-rose-400', bg: 'hover:bg-rose-500/10 border-rose-500/10' },
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/5 ${item.bg} transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]`}
                            >
                                <div className={`${item.color} transition-transform duration-200 group-hover:scale-110`}>{item.icon}</div>
                                <span className="text-white text-xs font-bold">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
