const STORAGE_KEY = 'viakids_attendance';

const initialRecords = [
    { id: 'A001', studentId: 'S01', studentName: 'Mateo García', busId: 'B01', busPatente: 'AB-1234', route: 'Ruta Norte', timestamp: '2026-05-06T07:15:00', action: 'boarded', tripType: 'morning' },
    { id: 'A002', studentId: 'S02', studentName: 'Sofía Rodríguez', busId: 'B01', busPatente: 'AB-1234', route: 'Ruta Norte', timestamp: '2026-05-06T07:18:00', action: 'boarded', tripType: 'morning' },
    { id: 'A003', studentId: 'S03', studentName: 'Lucas Martínez', busId: 'B03', busPatente: 'EF-9012', route: 'Ruta Sur', timestamp: '2026-05-06T07:22:00', action: 'absent', tripType: 'morning' },
    { id: 'A004', studentId: 'S01', studentName: 'Mateo García', busId: 'B01', busPatente: 'AB-1234', route: 'Ruta Norte', timestamp: '2026-05-06T16:05:00', action: 'disembarked', tripType: 'afternoon' },
];

const getDb = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialRecords;
};

const saveDb = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const attendanceService = {
    getAll: async () => {
        return new Promise(r => setTimeout(() => r(getDb()), 300));
    },

    scanQR: async (qrData, action = 'boarded') => {
        return new Promise(resolve => {
            const db = getDb();
            const record = {
                id: `A${Date.now()}`,
                studentId: qrData.id,
                studentName: qrData.nombre,
                busId: qrData.busId || '',
                busPatente: qrData.bus || 'N/A',
                route: qrData.ruta || 'N/A',
                timestamp: new Date().toISOString(),
                action,
                tripType: new Date().getHours() < 14 ? 'morning' : 'afternoon',
            };
            db.push(record);
            saveDb(db);

            const studentStatus = action === 'boarded' ? 'En el bus' : action === 'disembarked' ? 'Entregado' : 'Ausente';

            resolve({ success: true, data: record, studentStatus });
        });
    },

    getStudentStatus: async (studentId) => {
        return new Promise(resolve => {
            const db = getDb();
            const today = new Date().toISOString().split('T')[0];
            const todayRecords = db
                .filter(r => r.studentId === studentId && r.timestamp.startsWith(today))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            if (todayRecords.length === 0) {
                resolve({ status: 'Sin registro', lastAction: null, lastTime: null });
                return;
            }

            const latest = todayRecords[0];
            const statusMap = { boarded: 'En el bus', disembarked: 'Entregado', absent: 'Ausente' };
            resolve({
                status: statusMap[latest.action] || 'Desconocido',
                lastAction: latest.action,
                lastTime: new Date(latest.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
                record: latest,
            });
        });
    },

    getByStudent: async (studentId) => {
        return new Promise(resolve => {
            const db = getDb();
            const records = db.filter(r => r.studentId === studentId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            resolve(records);
        });
    },

    getByBus: async (busId) => {
        return new Promise(resolve => {
            const db = getDb();
            const today = new Date().toISOString().split('T')[0];
            const records = db.filter(r => r.busId === busId && r.timestamp.startsWith(today)).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            resolve(records);
        });
    },

    getTodaySummary: async () => {
        return new Promise(resolve => {
            const db = getDb();
            const today = new Date().toISOString().split('T')[0];
            const todayRecords = db.filter(r => r.timestamp.startsWith(today));

            const boarded = todayRecords.filter(r => r.action === 'boarded').length;
            const disembarked = todayRecords.filter(r => r.action === 'disembarked').length;
            const absent = todayRecords.filter(r => r.action === 'absent').length;

            resolve({ boarded, disembarked, absent, total: todayRecords.length });
        });
    },
};
