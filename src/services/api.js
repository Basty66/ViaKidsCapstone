const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = (extra = {}) => ({
    'Content-Type': 'application/json',
    ...extra,
});

const getAuthHeaders = (extra = {}) => {
    const token = localStorage.getItem('viakids_token_v2') || localStorage.getItem('token');
    return {
        ...getHeaders(extra),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

const request = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    const config = {
        ...options,
        headers: options.auth !== false ? getAuthHeaders(options.headers) : getHeaders(options.headers),
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
                Object.keys(localStorage).filter(k => k.startsWith('viakids_')).forEach(k => localStorage.removeItem(k));
                window.location.href = '/';
            }
            throw new Error(errorData.message || `Error ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        return response;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error.message);
        throw error;
    }
};

export const api = {
    // Auth
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }), auth: false }),
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data), auth: false }),
    getProfile: () => request('/auth/me'),

    // Users
    getUsers: () => request('/users'),
    createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
    updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

    // Students
    getStudents: () => request('/students'),
    getStudent: (id) => request(`/students/${id}`),
    createStudent: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
    updateStudent: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),
    getStudentQR: (id) => request(`/students/${id}/qr`),

    // Buses
    getBuses: () => request('/buses'),
    getBus: (id) => request(`/buses/${id}`),
    createBus: (data) => request('/buses', { method: 'POST', body: JSON.stringify(data) }),
    updateBus: (id, data) => request(`/buses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteBus: (id) => request(`/buses/${id}`, { method: 'DELETE' }),
    getBusLocation: (id) => request(`/buses/${id}/location`),

    // Routes
    getRoutes: () => request('/routes'),
    getRoute: (id) => request(`/routes/${id}`),
    createRoute: (data) => request('/routes', { method: 'POST', body: JSON.stringify(data) }),
    updateRoute: (id, data) => request(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRoute: (id) => request(`/routes/${id}`, { method: 'DELETE' }),

    // Attendance / QR Scanning
    scanQR: (data) => request('/attendance/scan', { method: 'POST', body: JSON.stringify(data) }),
    getAttendance: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return request(`/attendance?${params}`);
    },
    getStudentAttendance: (studentId) => request(`/attendance/student/${studentId}`),

    // Notifications
    getNotifications: () => request('/notifications'),
    createNotification: (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
    markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),

    // Incidents
    getIncidents: () => request('/incidents'),
    createIncident: (data) => request('/incidents', { method: 'POST', body: JSON.stringify(data) }),

    // Reports
    getAttendanceReport: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return request(`/reports/attendance?${params}`);
    },
};

export const mockApi = {
    login: async (email, password) => {
        await new Promise(r => setTimeout(r, 800));

        const accounts = {
            'admin@viakids.cl': { role: 'admin', name: 'Administrador', fullName: 'Admin ViaKids' },
            'conductor@viakids.cl': { role: 'driver', name: 'Conductor', fullName: 'Juan Pérez' },
            'apoderado@viakids.cl': { role: 'parent', name: 'Apoderado', fullName: 'Carlos Ruiz' },
        };

        const account = accounts[email.toLowerCase()];

        if (!account) {
            throw new Error('Correo no registrado en el sistema');
        }

        if (!password || password.length < 6) {
            throw new Error('Contraseña incorrecta');
        }

        return {
            token: `fake-jwt-${Date.now()}-${account.role}`,
            role: account.role,
            name: account.fullName,
        };
    },

    getStudents: async () => {
        await new Promise(r => setTimeout(r, 300));
        return [
            { id: 'S01', nombre: 'Mateo García', curso: '4to B', rut: '20.123.456-7', apoderado: 'Carlos García', telefono: '+56912345678', busId: 'B01', busPatente: 'AB-1234', ruta: 'Ruta Norte', colegio: 'Colegio Los Andes', estado: 'En espera' },
            { id: 'S02', nombre: 'Sofía Rodríguez', curso: '2do A', rut: '21.234.567-8', apoderado: 'María Rodríguez', telefono: '+56987654321', busId: 'B01', busPatente: 'AB-1234', ruta: 'Ruta Norte', colegio: 'Colegio Los Andes', estado: 'En espera' },
            { id: 'S03', nombre: 'Lucas Martínez', curso: '3ro C', rut: '20.345.678-9', apoderado: 'Pedro Martínez', telefono: '+56911223344', busId: 'B03', busPatente: 'EF-9012', ruta: 'Ruta Sur', colegio: 'Colegio Santiago', estado: 'En espera' },
        ];
    },

    getBuses: async () => {
        await new Promise(r => setTimeout(r, 300));
        return [
            { id: 'B01', patente: 'AB-1234', conductor: 'Juan Pérez', capacidad: 40, estado: 'En Ruta', tiempoEstimado: '15 min', lat: -33.4489, lng: -70.6693 },
            { id: 'B02', patente: 'CD-5678', conductor: 'Ana López', capacidad: 35, estado: 'En Espera', tiempoEstimado: '--', lat: -33.4560, lng: -70.6500 },
            { id: 'B03', patente: 'EF-9012', conductor: 'Carlos Ruiz', capacidad: 45, estado: 'En Ruta', tiempoEstimado: '30 min', lat: -33.4400, lng: -70.6800 },
        ];
    },

    getRoutes: async () => {
        await new Promise(r => setTimeout(r, 300));
        return [
            { id: 'R01', nombre: 'Ruta Norte', colegio: 'Colegio Los Andes', busId: 'B01', horario: '07:30', paradas: 8 },
            { id: 'R02', nombre: 'Ruta Sur', colegio: 'Colegio Santiago', busId: 'B03', horario: '08:00', paradas: 6 },
        ];
    },

    getUsers: async () => {
        await new Promise(r => setTimeout(r, 300));
        return [
            { id: 1, nombre: 'Juan Pérez', email: 'juan@viakids.cl', rol: 'Administrador', telefono: '+56912345678', estado: 'Activo', extra: '-' },
            { id: 2, nombre: 'Ana López', email: 'ana@viakids.cl', rol: 'Conductor', telefono: '+56987654321', estado: 'Activo', extra: 'Lic. Clase A' },
            { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@viakids.cl', rol: 'Apoderado', telefono: '+56911223344', estado: 'Activo', extra: 'Estudiante: Mateo García' },
        ];
    },

    getNotifications: async () => {
        await new Promise(r => setTimeout(r, 300));
        return [
            { id: 1, fecha: 'Hoy, 07:45', tipo: 'Alerta', mensaje: 'Bus retrasado 15 min por tráfico.', ruta: 'Ruta Norte', leido: false },
            { id: 2, fecha: 'Hoy, 08:00', tipo: 'Info', mensaje: 'Todos los buses operando normalmente.', ruta: 'Todas', leido: true },
            { id: 3, fecha: 'Ayer, 16:30', tipo: 'Info', mensaje: 'Ruta completada exitosamente.', ruta: 'Ruta Sur', leido: true },
        ];
    },

    getAttendance: async () => {
        await new Promise(r => setTimeout(r, 300));
        return [
            { id: 1, fecha: '06-05-2026', hora: '07:15', estudiante: 'Mateo García', ruta: 'Ruta Norte', bus: 'AB-1234', estado: 'Abordó' },
            { id: 2, fecha: '06-05-2026', hora: '07:18', estudiante: 'Sofía Rodríguez', ruta: 'Ruta Norte', bus: 'AB-1234', estado: 'Abordó' },
            { id: 3, fecha: '06-05-2026', hora: '07:22', estudiante: 'Lucas Martínez', ruta: 'Ruta Sur', bus: 'EF-9012', estado: 'Ausente' },
            { id: 4, fecha: '06-05-2026', hora: '16:05', estudiante: 'Mateo García', ruta: 'Ruta Norte', bus: 'AB-1234', estado: 'Entregado' },
        ];
    },

    getIncidents: async () => {
        await new Promise(r => setTimeout(r, 300));
        return [
            { id: 1, fecha: '06-05-2026', tipo: 'Mecánico', descripcion: 'Falla menor en motor, resuelto en ruta.', bus: 'AB-1234', resuelto: true },
            { id: 2, fecha: '05-05-2026', tipo: 'Tráfico', descripcion: 'Retraso de 20 min por congestión.', bus: 'EF-9012', resuelto: true },
        ];
    },
};
