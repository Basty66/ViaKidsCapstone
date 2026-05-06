import { useState, useEffect, useMemo } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("Todos");

    useEffect(() => {
        let isMounted = true;

        userService.getAll()
            .then(data => {
                if (isMounted) {
                    setUsers(data || []);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error("Error cargando usuarios:", error);
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchLower = searchTerm.toLowerCase();

            // Usamos ?. para evitar errores si algún campo viene nulo desde el backend
            const matchesSearch =
                user.nombre?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower);

            const matchesRole = roleFilter === "Todos" || user.rol === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const addUser = async (newUser) => {
        try {
            const res = await userService.create(newUser);
            if (res?.success) {
                setUsers(p => [...p, res.data]);
            }
            return res;
        } catch (error) {
            console.error("Error al crear usuario:", error);
            return { success: false, error: "Error de conexión" };
        }
    };

    const updateUser = async (updatedUser) => {
        try {
            const res = await userService.update(updatedUser);
            if (res?.success) {
                setUsers(p => p.map(u => u.id === updatedUser.id ? res.data : u));
            }
            return res;
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            return { success: false, error: "Error de conexión" };
        }
    };

    const deleteUser = async (id) => {
        try {
            const res = await userService.delete(id);
            if (res?.success) {
                setUsers(p => p.filter(u => u.id !== id));
            }
            return res;
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            return { success: false, error: "Error de conexión" };
        }
    };

    // Nueva función requerida por la interfaz para el botón de suspender/activar
    const toggleUserStatus = async (id) => {
        try {
            const userToUpdate = users.find(u => u.id === id);
            if (!userToUpdate) return { success: false };

            const updatedUser = {
                ...userToUpdate,
                estado: userToUpdate.estado === 'Activo' ? 'Suspendido' : 'Activo'
            };

            // Reutilizamos tu método update del servicio
            const res = await userService.update(updatedUser);
            if (res?.success) {
                setUsers(p => p.map(u => u.id === id ? res.data : u));
            }
            return res;
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            return { success: false, error: "Error de conexión" };
        }
    };

    return {
        users: filteredUsers, // Exportamos los usuarios ya filtrados
        loading,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus // Exportado para que los botones funcionen
    };
};