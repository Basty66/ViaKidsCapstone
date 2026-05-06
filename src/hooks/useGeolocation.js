import { useState, useEffect } from 'react';

export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [watchId, setWatchId] = useState(null);

    const startWatching = () => {
        if (!navigator.geolocation) {
            setError('Geolocalización no soportada');
            return;
        }

        const id = navigator.geolocation.watchPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    speed: position.coords.speed,
                    timestamp: position.timestamp,
                });
                setError(null);
            },
            (err) => {
                setError(err.message);
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
        setWatchId(id);
    };

    const stopWatching = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
    };

    useEffect(() => {
        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        };
    }, [watchId]);

    return { location, error, startWatching, stopWatching, isTracking: watchId !== null };
};
