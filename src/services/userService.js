// src/services/userService.js
export const userService = {
    getAll: async () => {
        // Simulando llamada a API con estructura extendida
        return [
            {
                id: 1,
                nombre: 'Juan Pérez',
                email: 'juan@viakids.cl',
                rol: 'Administrador',
                telefono: '+56912345678',
                estado: 'Activo',
                extra: '-'
            },
            {
                id: 2,
                nombre: 'Ana López',
                email: 'ana@viakids.cl',
                rol: 'Conductor',
                telefono: '+56987654321',
                estado: 'Activo',
                extra: 'Lic. Clase A'
            },
            {
                id: 3,
                nombre: 'Carlos Ruiz',
                email: 'carlos@viakids.cl',
                rol: 'Apoderado',
                telefono: '+56911223344',
                estado: 'Activo',
                extra: 'Estudiante: Pedro Ruiz'
            },
        ];
    },

    create: async (user) => {
        // Retornamos el objeto incluyendo el campo extra
        return {
            success: true,
            data: {
                ...user,
                id: Date.now(),
                extra: user.extra || '-'
            }
        };
    },

    update: async (user) => {
        return { success: true, data: user };
    },

    delete: async (id) => {
        return { success: true };
    }
};