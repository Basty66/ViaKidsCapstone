import { useState } from 'react';

export const useCamera = () => {
    const [permissionGranted, setPermissionGranted] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            stream.getTracks().forEach(track => track.stop());
            setPermissionGranted(true);
            setPermissionDenied(false);
            return true;
        } catch (err) {
            console.error('Camera permission error:', err);
            setPermissionGranted(false);
            setPermissionDenied(true);
            return false;
        }
    };

    const getStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setCameraActive(true);
            return stream;
        } catch {
            setPermissionDenied(true);
            return null;
        }
    };

    const stopStream = (stream) => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setCameraActive(false);
    };

    return { permissionGranted, permissionDenied, cameraActive, requestCameraPermission, getStream, stopStream };
};
