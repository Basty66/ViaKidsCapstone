import { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Bell, Send, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { mockApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useEffect } from 'react';

export const Notifications = () => {
    const [formData, setFormData] = useState({ ruta: '', tipo: 'Info', mensaje: '' });
    const [historial, setHistorial] = useState([]);
    const [routes, setRoutes] = useState([]);
    const toast = useToast();

    const { connected, publish } = useWebSocket({
        onNotification: (data) => {
            setHistorial(prev => [{ id: Date.now(), fecha: 'Justo ahora', tipo: data.tipo || 'Info', mensaje: data.message || JSON.stringify(data), ruta: data.ruta || 'Sistema', leido: false }, ...prev]);
        },
    });

    useEffect(() => {
        mockApi.getNotifications().then(setHistorial);
        mockApi.getRoutes().then(setRoutes);
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (!formData.mensaje || !formData.ruta) { toast.warning('Completa todos los campos'); return; }

        const nueva = { id: Date.now(), fecha: 'Justo ahora', ...formData, leido: false };
        setHistorial([nueva, ...historial]);
        setFormData({ ruta: '', tipo: 'Info', mensaje: '' });
        publish('/exchange/notifications', { ...formData, timestamp: new Date().toISOString() });
        toast.success('Notificación enviada');
    };

    const typeConfig = {
        Info: { icon: <Bell size={22} />, bg: 'bg-blue-500/20 text-blue-400' },
        Alerta: { icon: <AlertTriangle size={22} />, bg: 'bg-amber-500/20 text-amber-400' },
        Urgente: { icon: <AlertCircle size={22} />, bg: 'bg-red-500/20 text-red-400' },
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between glass p-6 rounded-3xl animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <Bell className="text-blue-400" size={28} />
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white">Centro de Notificaciones</h1>
                            <p className="text-slate-400 text-sm">Envía alertas a los padres por ruta</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 ${connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        {connected ? 'Conectado' : 'Desconectado'}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 glass p-6 rounded-2xl animate-fade-in-up h-fit" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Send size={18} className="text-blue-400" /> Nueva Notificación</h2>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 ml-1 mb-1 block">Destinatarios</label>
                                <select value={formData.ruta} onChange={e => setFormData({ ...formData, ruta: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 outline-none [&>option]:bg-slate-900">
                                    <option value="">Seleccionar Ruta...</option>
                                    {routes.map(r => (<option key={r.id} value={r.nombre}>{r.nombre}</option>))}
                                    <option value="Todas">Todas las Rutas</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 ml-1 mb-1 block">Tipo</label>
                                <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 outline-none [&>option]:bg-slate-900">
                                    <option value="Info">Información Normal</option>
                                    <option value="Alerta">Alerta de Retraso</option>
                                    <option value="Urgente">Aviso Urgente</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 ml-1 mb-1 block">Mensaje</label>
                                <textarea rows="4" placeholder="Escribe el mensaje..." value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 outline-none resize-none" />
                            </div>
                            <button type="submit" disabled={!formData.ruta || !formData.mensaje} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all btn-ripple shadow-lg shadow-blue-600/20">
                                <Send size={18} /> Enviar
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 glass p-6 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-lg font-bold text-white mb-4">Historial</h2>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {historial.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">Sin notificaciones</p>
                            ) : historial.map((notif) => {
                                const config = typeConfig[notif.tipo] || typeConfig.Info;
                                return (
                                    <div key={notif.id} className={`p-4 rounded-xl border transition-all ${notif.leido ? 'bg-slate-900/30 border-white/5' : 'bg-blue-500/5 border-blue-500/20'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`p-3 rounded-full shrink-0 ${config.bg}`}>{config.icon}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-white">{notif.ruta}</h3>
                                                        {!notif.leido && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                                                    </div>
                                                    <span className="text-xs text-slate-500 shrink-0">{notif.fecha}</span>
                                                </div>
                                                <p className="text-slate-300 text-sm mt-1">{notif.mensaje}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
