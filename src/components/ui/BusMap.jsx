import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';

const busIconHtml = (color = '#3b82f6') => `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M12 14h12M12 18h12M14 22h8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="18" cy="11" r="1.5" fill="white"/>
    </svg>
`;

const createBusIcon = (color = '#3b82f6') => L.divIcon({
    html: busIconHtml(color),
    className: 'bus-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
});

const MapFixer = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

const TileLoader = ({ onTilesLoaded }) => {
    const map = useMap();
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleLoad = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            onTilesLoaded();
        };

        map.on('load', handleLoad);
        map.whenReady(() => {
            if (map._loaded) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                onTilesLoaded();
            }
        });

        timeoutRef.current = setTimeout(() => {
            onTilesLoaded();
        }, 3000);

        return () => {
            map.off('load', handleLoad);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [map, onTilesLoaded]);
    return null;
};

const BusMap = ({
    center = [-33.4489, -70.6693],
    zoom = 13,
    markers = [],
    showUserLocation = false,
    height = '400px',
    className = '',
}) => {
    const [tilesLoaded, setTilesLoaded] = useState(false);
    const tilesLoadedRef = useRef(false);

    const handleTilesLoaded = useCallback(() => {
        if (!tilesLoadedRef.current) {
            tilesLoadedRef.current = true;
            setTilesLoaded(true);
        }
    }, []);

    useEffect(() => {
        tilesLoadedRef.current = false;
        setTilesLoaded(false);

        const timeout = setTimeout(() => {
            setTilesLoaded(true);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [center, zoom]);

    return (
        <div className={`relative w-full bg-slate-900 ${className}`} style={{ height }}>
            {!tilesLoaded && (
                <div className="absolute inset-0 z-[1000] bg-slate-900 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="text-blue-400 animate-spin" size={32} />
                    <p className="text-slate-400 text-sm">Cargando mapa...</p>
                </div>
            )}
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                zoomControl={false}
            >
                <TileLoader onTilesLoaded={handleTilesLoaded} />
                <MapFixer />
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/" class="text-blue-400">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    crossOrigin="anonymous"
                />
                {markers.map((marker, i) => (
                    <Marker
                        key={`${marker.position[0]}-${marker.position[1]}-${i}`}
                        position={marker.position}
                        icon={createBusIcon(marker.color)}
                    >
                        {marker.popup && (
                            <Popup className="rounded-xl">
                                <div className="p-2 text-slate-800">{marker.popup}</div>
                            </Popup>
                        )}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export { BusMap, createBusIcon };
