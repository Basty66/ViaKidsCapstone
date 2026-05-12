// src/services/routeService.js

const STORAGE_KEY = 'viakids_routes';

// Datos iniciales de prueba (Mock)
const initialRoutes = [
    { id: 'R01', nombre: 'Ruta Norte', colegio: 'Colegio Los Andes', busId: 'AB-1234', horario: '07:30' },
    { id: 'R02', nombre: 'Ruta Sur', colegio: 'Colegio Santiago', busId: 'CD-5678', horario: '08:00' },
];

// Funciones auxiliares para manejar el LocalStorage
const getDb = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : initialRoutes;
    } catch { return initialRoutes; }
};

const saveDb = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

// Servicio exportado con todas las operaciones CRUD
export const routeService = {
    // Obtener todas las rutas (con un pequeño delay para simular red)
    getAll: async () => {
        return new Promise((resolve) => setTimeout(() => resolve(getDb()), 300));
    },

    // Crear una nueva ruta
    create: async (newRoute) => {
        const db = getDb();
        const route = { ...newRoute, id: `R${Date.now()}` };
        db.push(route);
        saveDb(db);
        return { success: true, data: route };
    },

    // Actualizar una ruta existente
    update: async (route) => {
        let db = getDb();
        db = db.map(r => r.id === route.id ? route : r);
        saveDb(db);
        return { success: true, data: route };
    },

    // Eliminar una ruta por su ID
    delete: async (id) => {
        let db = getDb();
        db = db.filter(r => r.id !== id);
        saveDb(db);
        return { success: true };
    }
};