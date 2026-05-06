// src/services/apiService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Función auxiliar para manejar las peticiones y errores de forma centralizada
 */
const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        // Manejo de errores de estatus HTTP (400, 500, etc.)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Service Error:", error);
        throw error; // Lanzamos el error para que el componente (LoginForm/etc) pueda manejarlo
    }
};

// Objeto centralizado con los endpoints de tu aplicación
export const apiService = {
    // Auth
    login: (email, password) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),

    // Estudiantes (Ejemplo)
    getStudents: () => request('/students', { method: 'GET' }),

    // Buses
    getBuses: () => request('/buses', { method: 'GET' }),

    // Notificaciones
    getNotifications: () => request('/notifications', { method: 'GET' }),
};