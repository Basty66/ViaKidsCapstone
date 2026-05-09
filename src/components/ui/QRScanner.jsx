import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw, X, QrCode, Lock, Smartphone, Upload } from 'lucide-react';

export const QRScanner = ({ onScan, onError, active = true }) => {
    const [scanning, setScanning] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [cameraReady, setCameraReady] = useState(false);
    const [permissionState, setPermissionState] = useState('prompt');
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [requestingPermission, setRequestingPermission] = useState(false);
    const [scanningFile, setScanningFile] = useState(false);
    const fileInputRef = useRef(null);
    const scannerRef = useRef(null);
    const containerIdRef = useRef('qr-reader-' + Math.random().toString(36).slice(2, 8));

    const checkCameraPermission = async () => {
        try {
            setRequestingPermission(true);

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setCameraError('Tu navegador no soporta acceso a cámara');
                setPermissionState('denied');
                setRequestingPermission(false);
                return;
            }

            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                setCameraError('Se requiere conexión segura (HTTPS) para usar la cámara');
                setPermissionState('denied');
                setRequestingPermission(false);
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            stream.getTracks().forEach(track => track.stop());

            const devices = await Html5Qrcode.getCameras();
            setCameras(devices);

            if (devices && devices.length > 0) {
                setPermissionState('granted');
                const rearCamera = devices.find(d =>
                    d.label.toLowerCase().includes('back') ||
                    d.label.toLowerCase().includes('rear') ||
                    d.label.toLowerCase().includes('trasera') ||
                    d.label.toLowerCase().includes('environment') ||
                    d.label.toLowerCase().includes('trasera') ||
                    d.label.toLowerCase().includes('posterior')
                ) || devices[0];
                setSelectedCamera(rearCamera);
            } else {
                setCameraError('No se encontró ninguna cámara');
                setPermissionState('denied');
            }
        } catch (err) {
            if (err.name === 'NotAllowedError') {
                setCameraError('Permiso de cámara denegado. Actívalo en la configuración del navegador.');
            } else if (err.name === 'NotFoundError') {
                setCameraError('No se encontró cámara en este dispositivo');
            } else {
                setCameraError('Error al acceder a la cámara: ' + err.message);
            }
            setPermissionState('denied');
        }
        setRequestingPermission(false);
    };

    useEffect(() => {
        if (active) {
            checkCameraPermission();
        }
        return () => { stopScanner(); };
    }, [active]);

    const startScanner = useCallback(async () => {
        try {
            setCameraError('');
            const html5QrCode = new Html5Qrcode(containerIdRef.current);
            scannerRef.current = html5QrCode;

            const qrSize = Math.min(window.innerWidth - 64, 250);
            const config = {
                fps: 15,
                qrbox: { width: qrSize, height: qrSize },
                aspectRatio: 1.0,
                disableFlip: false,
            };

            if (selectedCamera) {
                await html5QrCode.start(
                    selectedCamera.id,
                    {
                        fps: 15,
                        qrbox: { width: qrSize, height: qrSize },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        try {
                            const data = JSON.parse(decodedText);
                            onScan(data);
                        } catch {
                            onScan({ raw: decodedText, id: decodedText });
                        }
                    },
                    () => {}
                );
            } else {
                await html5QrCode.start(
                    { facingMode: 'environment' },
                    config,
                    (decodedText) => {
                        try {
                            const data = JSON.parse(decodedText);
                            onScan(data);
                        } catch {
                            onScan({ raw: decodedText, id: decodedText });
                        }
                    },
                    () => {}
                );
            }

            setScanning(true);
            setCameraReady(true);
        } catch (err) {
            setCameraError('Error al iniciar la cámara: ' + err.message);
            setPermissionState('denied');
            if (onError) onError(err);
        }
    }, [selectedCamera, onScan, onError]);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch {}
            scannerRef.current = null;
            setScanning(false);
            setCameraReady(false);
        }
    }, []);

    const handleFileScan = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (scanning) await stopScanner();
        setScanningFile(true);
        setCameraError('');
        const tempScanner = new Html5Qrcode(containerIdRef.current);
        try {
            const decodedText = await tempScanner.scanFile(file, true);
            await tempScanner.clear();
            try {
                const data = JSON.parse(decodedText);
                onScan(data);
            } catch {
                onScan({ raw: decodedText, id: decodedText });
            }
        } catch (err) {
            setCameraError('No se pudo leer el QR de la imagen: ' + err.message);
            try { await tempScanner.clear(); } catch {}
        }
        setScanningFile(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [onScan, scanning, stopScanner]);

    const toggleScanner = useCallback(() => {
        if (scanning) {
            stopScanner();
        } else {
            startScanner();
        }
    }, [scanning, startScanner, stopScanner]);

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* HTTPS Warning */}
            {window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-2xl text-xs text-center w-full max-w-sm">
                    <Lock size={16} className="inline mr-1" />
                    Se requiere HTTPS para usar la cámara
                </div>
            )}

            {cameraError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl text-sm text-center w-full max-w-sm">
                    <CameraOff size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="font-bold mb-1">Cámara no disponible</p>
                    <p className="text-xs opacity-75">{cameraError}</p>
                    <button
                        onClick={checkCameraPermission}
                        disabled={requestingPermission}
                        className="mt-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={requestingPermission ? 'animate-spin' : ''} />
                        {requestingPermission ? 'Solicitando...' : 'Reintentar'}
                    </button>
                </div>
            )}

            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-black">
                <div id={containerIdRef.current} style={{ minHeight: 220, maxHeight: '70vw' }} />
                {!scanning && permissionState === 'granted' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center animate-float">
                            <QrCode size={40} className="text-purple-400" />
                        </div>
                        <p className="text-white/70 text-sm text-center px-4">Toca para escanear un código QR</p>
                    </div>
                )}
                {requestingPermission && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm gap-3">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-white/70 text-sm">Solicitando acceso a cámara...</p>
                    </div>
                )}
            </div>

            <div className="flex gap-3 w-full max-w-sm">
                <button
                    onClick={toggleScanner}
                    disabled={permissionState === 'denied' || requestingPermission}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        scanning
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20'
                            : permissionState === 'denied' || requestingPermission
                            ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                    }`}
                >
                    {scanning ? <><X size={18} /> Detener</> : <><Camera size={18} /> Escanear QR</>}
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={scanningFile}
                    className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                    <Upload size={18} /> Subir imagen
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileScan}
                    className="hidden"
                />
            </div>

            {scanning && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Escaneando... Apunta la cámara al código QR
                </div>
            )}
            {scanningFile && (
                <div className="flex items-center gap-2 text-purple-400 text-sm">
                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    Leyendo QR de la imagen...
                </div>
            )}

            {cameras.length > 1 && !scanning && (
                <div className="w-full max-w-sm">
                    <label className="text-xs text-slate-400 mb-1 block">Seleccionar cámara:</label>
                    <select
                        value={selectedCamera?.id || ''}
                        onChange={(e) => {
                            const cam = cameras.find(c => c.id === e.target.value);
                            setSelectedCamera(cam);
                        }}
                        className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 text-sm [&>option]:bg-slate-900"
                    >
                        {cameras.map((cam, i) => (
                            <option key={cam.id} value={cam.id}>
                                {cam.label || `Cámara ${i + 1}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};
