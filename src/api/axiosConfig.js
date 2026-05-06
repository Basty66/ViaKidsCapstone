import axios from 'axios';

// 1. Creamos la instancia base de Axios
const api = axios.create({
    // URL base de tu backend local. Cuando despliegues en Railway/Render, la cambiarás aquí.
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // Opcional: un tiempo de espera máximo (ej: 10 segundos) por si el servidor se cuelga
    timeout: 10000,
});

// 2. Interceptor de Peticiones (Request)
// Esto se ejecuta ANTES de que cualquier petición salga hacia el backend
api.interceptors.request.use(
    (config) => {
        // Buscamos el token JWT que guardamos en el localStorage al hacer login
        const token = localStorage.getItem('token');

        // Si existe el token, lo inyectamos en las cabeceras de autorización
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor de Respuestas (Response) - Opcional pero muy profesional
// Esto atrapa respuestas globales del backend antes de que lleguen a tus componentes
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el backend responde con un 401 (No autorizado) porque el token expiró
        if (error.response && error.response.status === 401) {
            console.warn("Sesión expirada o token inválido. Redirigiendo al login...");
            // Aquí podrías limpiar el localStorage y redirigir al usuario al Login
            // localStorage.removeItem('token');
            // localStorage.removeItem('userRole');
            // window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default api;