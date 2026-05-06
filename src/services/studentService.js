const STORAGE_KEY = 'viakids_students';

const initialStudents = [
    { id: 'S01', nombre: 'Mateo García', curso: '4to B', rut: '20.123.456-7', apoderado: 'Carlos García', telefono: '+56912345678', busId: 'B01', busPatente: 'AB-1234', ruta: 'Ruta Norte', colegio: 'Colegio Los Andes', estado: 'En espera' },
    { id: 'S02', nombre: 'Sofía Rodríguez', curso: '2do A', rut: '21.234.567-8', apoderado: 'María Rodríguez', telefono: '+56987654321', busId: 'B01', busPatente: 'AB-1234', ruta: 'Ruta Norte', colegio: 'Colegio Los Andes', estado: 'En espera' },
    { id: 'S03', nombre: 'Lucas Martínez', curso: '3ro C', rut: '20.345.678-9', apoderado: 'Pedro Martínez', telefono: '+56911223344', busId: 'B03', busPatente: 'EF-9012', ruta: 'Ruta Sur', colegio: 'Colegio Santiago', estado: 'En espera' },
];

const getDb = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialStudents;
};

const saveDb = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const studentService = {
    getAll: async () => {
        return new Promise(r => setTimeout(() => r(getDb()), 300));
    },

    create: async (newStudent) => {
        return new Promise(resolve => {
            const db = getDb();
            const student = {
                ...newStudent,
                id: `S${Date.now()}`,
                estado: newStudent.estado || 'En espera',
                rut: newStudent.rut || '',
                apoderado: newStudent.apoderado || '',
                telefono: newStudent.telefono || '',
                colegio: newStudent.colegio || '',
                ruta: newStudent.ruta || '',
                busPatente: newStudent.busPatente || '',
            };
            db.push(student);
            saveDb(db);
            resolve({ success: true, data: student });
        });
    },

    update: async (student) => {
        return new Promise(resolve => {
            let db = getDb();
            db = db.map(s => s.id === student.id ? student : s);
            saveDb(db);
            resolve({ success: true, data: student });
        });
    },

    delete: async (id) => {
        return new Promise(resolve => {
            let db = getDb();
            db = db.filter(s => s.id !== id);
            saveDb(db);
            resolve({ success: true });
        });
    },

    updateEstado: async (id, estado) => {
        return new Promise(resolve => {
            let db = getDb();
            db = db.map(s => s.id === id ? { ...s, estado } : s);
            saveDb(db);
            const updated = db.find(s => s.id === id);
            resolve({ success: true, data: updated });
        });
    },
};
