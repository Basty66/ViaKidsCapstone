import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Map as MapIcon, Navigation, AlertTriangle, Clock } from 'lucide-react';
import { BusMap } from '../components/ui/BusMap';
import { useBuses } from '../hooks/useBuses';
import { useNavigate } from 'react-router-dom';

export const LiveTracking = () => {
    const { allBuses } = useBuses();
    const [buses, setBuses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (allBuses.length > 0) {
            setBuses(allBuses.filter(b => b.estado === 'En Ruta').map(b => ({
                ...b,
                lat: b.lat || -33.4489,
                lng: b.lng || -70.6693,
            })));
        }
    }, [allBuses]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBuses(prev => prev.map(bus => ({
                ...bus,
                lat: bus.lat + (Math.random() - 0.5) * 0.002,
                lng: bus.lng + (Math.random() - 0.5) * 0.002,
            })));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const mapMarkers = useMemo(() => buses.map(bus => ({
        position: [bus.lat, bus.lng],
        color: '#3b82f6',
        popup: (
            <>
                <h3 className="font-bold border-b border-gray-100 pb-1">{bus.patente}</h3>
                <p className="text-xs mt-1">Conductor: <strong>{bus.conductor}</strong></p>
                <p className="text-xs">ETA: {bus.tiempoEstimado}</p>
            </>
        ),
    })), [buses]);

    const mapCenter = buses.length > 0 ? [buses[0].lat, buses[0].lng] : [-33.4489, -70.6693];

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass p-6 md:p-8 rounded-3xl gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3"><MapIcon className="text-blue-400" /> Monitoreo en Tiempo Real</h1>
                        <p className="text-slate-400 text-sm mt-1">Ubicación exacta de la flota activa</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                            <Navigation size={14} /> {buses.length} En Ruta
                        </div>
                        <div className="bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-amber-500/20">
                            <AlertTriangle size={14} /> {allBuses.filter(b => b.estado !== 'En Ruta').length} Detenidos
                        </div>
                    </div>
                </div>

                <div className="glass rounded-3xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <BusMap
                        center={mapCenter}
                        zoom={13}
                        markers={mapMarkers}
                        height="350px"
                        className="sm:h-[450px] md:h-[550px] lg:h-[600px]"
                    />
                    <div className="p-4 bg-slate-900/50 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-300"><Clock size={14} className="text-blue-400" /> Actualización cada 5s</div>
                        <div className="flex items-center gap-2 text-slate-300"><MapIcon size={14} className="text-emerald-400" /> Santiago, Chile</div>
                    </div>
                </div>

                {/* Bus List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allBuses.map((bus, i) => (
                        <button
                            key={bus.id}
                            onClick={() => navigate(`/admin/tracking?bus=${bus.id}`)}
                            className="glass p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all animate-fade-in-up text-left w-full"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className={`p-3 rounded-xl ${bus.estado === 'En Ruta' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                <Navigation size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold">{bus.patente}</p>
                                <p className="text-slate-400 text-sm">{bus.conductor}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${bus.estado === 'En Ruta' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {bus.estado}
                                </span>
                                {bus.estado === 'En Ruta' && <p className="text-slate-500 text-xs mt-1">ETA: {bus.tiempoEstimado}</p>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};
