import { QRCode } from 'react-qr-code';

export const QRCodeGenerator = ({ studentData, size = 200 }) => {
    if (!studentData) return null;

    const qrPayload = JSON.stringify({
        id: studentData.id,
        nombre: studentData.nombre,
        curso: studentData.curso,
        rut: studentData.rut || 'N/A',
        apoderado: studentData.apoderado || 'N/A',
        telefono: studentData.telefono || 'N/A',
        bus: studentData.busPatente || 'Sin asignar',
        ruta: studentData.ruta || 'Sin asignar',
        colegio: studentData.colegio || 'N/A',
    });

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
                <QRCode value={qrPayload} size={size} level="H" />
            </div>
            <p className="text-xs text-slate-400 text-center max-w-[200px]">
                {studentData.nombre} — {studentData.curso}
            </p>
        </div>
    );
};
