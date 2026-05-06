import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { LayoutDashboard, ClipboardCheck, AlertTriangle, Play, Square, QrCode, MapPin, Clock, Bus, CheckCircle, XCircle, Send, AlertCircle, Camera, Navigation, Gauge, Phone, User } from 'lucide-react';
import { QRScanner } from '../components/ui/QRScanner';
import { Modal } from '../components/ui/Modal';
import { Toggle } from '../components/ui/Toggle';
import { EmptyState } from '../components/ui/EmptyState';
import { useGeolocation } from '../hooks/useGeolocation';
import { attendanceService } from '../services/attendanceService';
import { mockApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const DriverDashboard = ({ tab }) => {
    const [activeTab, setActiveTab] = useState(tab || 'dashboard');
    const [routeActive, setRouteActive] = useState(false);
    const [routeStartTime, setRouteStartTime] = useState(null);
    const [routeDuration, setRouteDuration] = useState(0);
    const [todayAttendance, setTodayAttendance] = useState([]);
    const [busInfo, setBusInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [lastScan, setLastScan] = useState(null);
    const [scanAction, setScanAction] = useState('boarded');
    const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
    const [incidentForm, setIncidentForm] = useState({ tipo: 'Mecánico', descripcion: '' });
    const [morningTrip, setMorningTrip] = useState(true);
    const toast = useToast();

    const { location, error: geoError, startWatching, stopWatching, isTracking } = useGeolocation();

    useEffect(() => {
        setActiveTab(tab || 'dashboard');
    }, [tab]);

    useEffect(() => {
        mockApi.getBuses().then(buses => setBusInfo(buses[0]));
        mockApi.getStudents().then(setStudents);
        attendanceService.getAll().then(records => {
            const today = new Date().toISOString().split('T')[0];
            setTodayAttendance(records.filter(r => r.timestamp.startsWith(today)));
        });
        mockApi.getIncidents().then(setIncidents);
    }, []);

    useEffect(() => {
        if (routeActive) {
            startWatching();
        } else {
            stopWatching();
        }
    }, [routeActive]);

    useEffect(() => {
        if (!routeActive || !routeStartTime) {
            setRouteDuration(0);
            return;
        }
        setRouteDuration(Math.floor((Date.now() - routeStartTime.getTime()) / 60000));
        const interval = setInterval(() => {
            setRouteDuration(Math.floor((Date.now() - routeStartTime.getTime()) / 60000));
        }, 30000);
        return () => clearInterval(interval);
    }, [routeActive, routeStartTime]);

    const handleScan = async (qrData) => {
        if (!routeActive) {
            toast.warning('Inicia la ruta primero para tomar asistencia', 3000);
            return;
        }
        const result = await attendanceService.scanQR(qrData, scanAction);
        if (result.success) {
            setLastScan({ student: qrData.nombre, action: scanAction, time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) });
            toast.success(`${qrData.nombre} ${scanAction === 'boarded' ? 'abordó' : 'bajó'} del bus`);
            const today = new Date().toISOString().split('T')[0];
            attendanceService.getAll().then(records => {
                setTodayAttendance(records.filter(r => r.timestamp.startsWith(today)));
            });
        }
    };

    const handleStartRoute = () => {
        setRouteActive(true);
        setRouteStartTime(new Date());
        toast.success('Ruta iniciada correctamente', 3000);
    };

    const handleEndRoute = () => {
        setRouteActive(false);
        setRouteStartTime(null);
        toast.info('Ruta finalizada', 3000);
    };

    const handleSendIncident = async () => {
        if (!incidentForm.descripcion.trim()) {
            toast.warning('Describe la incidencia', 2000);
            return;
        }
        const newIncident = { id: Date.now(), fecha: new Date().toLocaleDateString('es-CL'), tipo: incidentForm.tipo, descripcion: incidentForm.descripcion, bus: busInfo?.patente || 'N/A', resuelto: false };
        setIncidents(prev => [newIncident, ...prev]);
        setIncidentForm({ tipo: 'Mecánico', descripcion: '' });
        setIsIncidentModalOpen(false);
        toast.success('Incidencia reportada correctamente');
    };

    const boardedToday = todayAttendance.filter(r => r.action === 'boarded').length;
    const disembarkedToday = todayAttendance.filter(r => r.action === 'disembarked').length;
    const absentToday = todayAttendance.filter(r => r.action === 'absent').length;

    const routeStudents = students.filter(s => s.busPatente === busInfo?.patente);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header with Route Control */}
                <div className="glass p-6 md:p-8 rounded-3xl animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
                                <Bus className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white">Panel del Conductor</h1>
                                {busInfo && (
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-0.5">
                                        <span className="font-bold text-blue-400">{busInfo.patente}</span>
                                        <span>•</span>
                                        <span>{busInfo.conductor}</span>
                                        <span>•</span>
                                        <span>Cap: {busInfo.capacidad}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Toggle enabled={morningTrip} onChange={setMorningTrip} label={morningTrip ? 'Mañana' : 'Tarde'} />
                            {!routeActive ? (
                                <button onClick={handleStartRoute} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 btn-ripple">
                                    <Play size={18} /> Iniciar Ruta
                                </button>
                            ) : (
                                <button onClick={handleEndRoute} className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 btn-ripple animate-pulse">
                                    <Square size={18} /> Finalizar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Route Active Banner */}
                {routeActive && routeStartTime && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-400 animate-pulse">
                            <Navigation size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-emerald-400 font-bold text-lg">Ruta en curso</p>
                            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm mt-1">
                                <span className="flex items-center gap-1"><Clock size={14} /> Inicio: {routeStartTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} /> Duración: {routeDuration} min</span>
                                {location && (
                                    <span className="flex items-center gap-1 text-emerald-400">
                                        <Navigation size={14} />
                                        {location.speed ? `${Math.round(location.speed * 3.6)} km/h` : 'Detenido'}
                                    </span>
                                )}
                            </div>
                        </div>
                        {location && (
                            <div className="text-right">
                                <p className="text-emerald-400 text-xs font-bold flex items-center gap-1"><Navigation size={12} /> GPS Activo</p>
                                <p className="text-slate-500 text-[10px]">±{Math.round(location?.accuracy || 0)}m</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 stagger-children">
                    <div className="glass p-4 rounded-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white/50 text-xs uppercase font-bold">Abordaron</p>
                                <h2 className="text-3xl font-bold text-blue-400 mt-1">{boardedToday}</h2>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400"><CheckCircle size={20} /></div>
                        </div>
                    </div>
                    <div className="glass p-4 rounded-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white/50 text-xs uppercase font-bold">Entregados</p>
                                <h2 className="text-3xl font-bold text-emerald-400 mt-1">{disembarkedToday}</h2>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400"><MapPin size={20} /></div>
                        </div>
                    </div>
                    <div className="glass p-4 rounded-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white/50 text-xs uppercase font-bold">Ausentes</p>
                                <h2 className="text-3xl font-bold text-red-400 mt-1">{absentToday}</h2>
                            </div>
                            <div className="p-3 rounded-xl bg-red-500/20 text-red-400"><XCircle size={20} /></div>
                        </div>
                    </div>
                    <div className="glass p-4 rounded-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white/50 text-xs uppercase font-bold">Pendientes</p>
                                <h2 className="text-3xl font-bold text-amber-400 mt-1">{routeStudents.length - boardedToday}</h2>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400"><Clock size={20} /></div>
                        </div>
                    </div>
                </div>

                {/* Last Scan Notification */}
                {lastScan && (
                    <div className={`p-5 rounded-2xl border flex items-center gap-4 animate-fade-in-down ${lastScan.action === 'boarded' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                        <div className={`p-3 rounded-xl ${lastScan.action === 'boarded' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {lastScan.action === 'boarded' ? <CheckCircle size={24} /> : <MapPin size={24} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold">{lastScan.student} {lastScan.action === 'boarded' ? 'abordó' : 'bajó'} del bus</p>
                            <p className="text-slate-400 text-sm">{lastScan.time}</p>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    {[
                        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
                        { key: 'asistencia', label: 'Asistencia QR', icon: <QrCode size={16} /> },
                        { key: 'incidencias', label: 'Incidencias', icon: <AlertTriangle size={16} /> },
                    ].map(t => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === t.key
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {t.icon}
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* Attendance Tab */}
                {activeTab === 'asistencia' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
                        <div className="glass p-6 rounded-2xl">
                            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <QrCode size={20} className="text-purple-400" /> Escanear QR
                            </h2>
                            {!routeActive && (
                                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl mb-4">
                                    <p className="text-amber-400 text-xs flex items-center gap-2">
                                        <AlertCircle size={14} /> Inicia la ruta para poder escanear
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-2 mb-4">
                                <button onClick={() => setScanAction('boarded')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${scanAction === 'boarded' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                    ↑ Subida (Abordó)
                                </button>
                                <button onClick={() => setScanAction('disembarked')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${scanAction === 'disembarked' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                    ↓ Bajada (Entregado)
                                </button>
                            </div>
                            <QRScanner onScan={handleScan} active={routeActive} />
                        </div>

                        <div className="glass p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ClipboardCheck size={20} className="text-blue-400" /> Estudiantes
                                </h2>
                                <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                                    {boardedToday}/{routeStudents.length} a bordo
                                </span>
                            </div>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                                {routeStudents.length === 0 ? (
                                    <EmptyState icon={<Bus size={32} className="text-slate-500" />} title="Sin estudiantes" description="No hay estudiantes asignados a este bus" />
                                ) : (
                                    routeStudents.map(student => {
                                        const record = todayAttendance.find(r => r.studentId === student.id && r.action === 'boarded');
                                        return (
                                            <div key={student.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${record ? 'bg-blue-500/5 border-blue-500/20' : 'bg-slate-900/40 border-white/5'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${record ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{student.nombre}</p>
                                                        <p className="text-slate-500 text-xs">{student.curso}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${record ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                    {record ? 'Abordó' : 'Pendiente'}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Incidents Tab */}
                {activeTab === 'incidencias' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-end">
                            <button onClick={() => setIsIncidentModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all btn-ripple">
                                <AlertTriangle size={18} /> Reportar Incidencia
                            </button>
                        </div>
                        {incidents.length === 0 ? (
                            <EmptyState icon={<CheckCircle size={32} className="text-emerald-400" />} title="Todo en orden" description="No hay incidencias reportadas" />
                        ) : (
                            <div className="space-y-3">
                                {incidents.map((incident, i) => (
                                    <div key={incident.id} className="glass p-5 rounded-2xl animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${incident.tipo === 'Mecánico' ? 'bg-amber-500/20 text-amber-400' : incident.tipo === 'Tráfico' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                {incident.tipo}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500 text-xs">{incident.fecha}</span>
                                                {incident.resuelto ? (
                                                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold">Resuelto</span>
                                                ) : (
                                                    <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs font-bold">Pendiente</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-white text-sm">{incident.descripcion}</p>
                                        <p className="text-slate-500 text-xs mt-2 flex items-center gap-1"><Bus size={12} /> {incident.bus}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="glass p-6 rounded-2xl animate-fade-in-up">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-amber-400" /> Registro de Hoy
                        </h2>
                        {todayAttendance.length === 0 ? (
                            <EmptyState icon={<Clock size={32} className="text-slate-500" />} title="Sin registros hoy" description="Inicia la ruta y escanea los QR para comenzar" />
                        ) : (
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {todayAttendance.map((record, i) => (
                                    <div key={record.id} className="flex items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg shrink-0 ${record.action === 'boarded' ? 'bg-blue-500/20 text-blue-400' : record.action === 'disembarked' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {record.action === 'boarded' ? <CheckCircle size={16} /> : record.action === 'disembarked' ? <MapPin size={16} /> : <XCircle size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{record.studentName}</p>
                                                <p className="text-slate-500 text-xs">{record.route} — {record.busPatente}</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-400 text-xs shrink-0">
                                            {new Date(record.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Incident Modal */}
            <Modal isOpen={isIncidentModalOpen} onClose={() => setIsIncidentModalOpen(false)} title="Reportar Incidencia">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                        <AlertCircle size={18} className="text-amber-400 shrink-0" />
                        <p className="text-amber-400 text-xs">Esta notificación se enviará al administrador</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Tipo de Incidencia</label>
                        <select value={incidentForm.tipo} onChange={e => setIncidentForm({ ...incidentForm, tipo: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 outline-none [&>option]:bg-slate-900">
                            <option>Mecánico</option>
                            <option>Tráfico</option>
                            <option>Clima</option>
                            <option>Estudiante</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Descripción</label>
                        <textarea rows="4" placeholder="Describe la incidencia con detalle..." value={incidentForm.descripcion} onChange={e => setIncidentForm({ ...incidentForm, descripcion: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 outline-none resize-none" />
                    </div>
                    <button onClick={handleSendIncident} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all btn-ripple">
                        <Send size={18} /> Enviar Reporte
                    </button>
                </div>
            </Modal>
        </DashboardLayout>
    );
};
