const STORAGE_KEY = 'viakids_buses';

const initialDb = [
    { id: 'B01', patente: 'AB-1234', conductor: 'Juan Pérez', capacidad: 40, estado: 'En Ruta', tiempoEstimado: '15 min', lat: -33.4489, lng: -70.6693 },
    { id: 'B02', patente: 'CD-5678', conductor: 'Ana López', capacidad: 35, estado: 'En Espera', tiempoEstimado: '--', lat: -33.4560, lng: -70.6500 },
    { id: 'B03', patente: 'EF-9012', conductor: 'Carlos Ruiz', capacidad: 45, estado: 'En Ruta', tiempoEstimado: '30 min', lat: -33.4400, lng: -70.6800 },
];

const getDb = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            saveDb(initialDb);
            return initialDb;
        }
        return JSON.parse(data);
    } catch {
        saveDb(initialDb);
        return initialDb;
    }
};

const saveDb = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const busService = {
    getAll: async () => new Promise(r => setTimeout(() => r(getDb()), 300)),

    isPatenteDuplicada: (patente, idExcluido = null) => {
        const db = getDb();
        return db.some(b => b.patente.toUpperCase() === patente.toUpperCase() && b.id !== idExcluido);
    },

    create: async (newBus) => {
        return new Promise(resolve => {
            const db = getDb();
            if (busService.isPatenteDuplicada(newBus.patente)) {
                resolve({ success: false, error: 'La patente ya existe' });
                return;
            }
            const busWithId = { ...newBus, id: `B${Math.floor(Math.random() * 900) + 100}`, capacidad: newBus.capacidad || 40, tiempoEstimado: newBus.estado === 'En Ruta' ? (newBus.tiempoEstimado || '30 min') : '--', lat: -33.4489, lng: -70.6693 };
            db.push(busWithId);
            saveDb(db);
            resolve({ success: true, data: busWithId });
        });
    },

    update: async (bus) => {
        return new Promise(resolve => {
            let db = getDb();
            if (busService.isPatenteDuplicada(bus.patente, bus.id)) {
                resolve({ success: false, error: 'La patente ya existe en otro registro' });
                return;
            }
            const updatedBus = { ...bus, tiempoEstimado: bus.estado === 'En Espera' ? '--' : (bus.tiempoEstimado || '30 min') };
            db = db.map(b => b.id === bus.id ? updatedBus : b);
            saveDb(db);
            resolve({ success: true, data: updatedBus });
        });
    },

    delete: async (id) => new Promise(resolve => { let db = getDb(); db = db.filter(b => b.id !== id); saveDb(db); resolve({ success: true }); }),

    updateLocation: async (id, lat, lng) => {
        return new Promise(resolve => {
            let db = getDb();
            db = db.map(b => b.id === id ? { ...b, lat, lng } : b);
            saveDb(db);
            resolve({ success: true });
        });
    },
};
