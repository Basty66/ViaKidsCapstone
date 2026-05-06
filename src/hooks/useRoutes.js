import { useState, useEffect } from 'react';
import { routeService } from '../services/routeService';

export const useRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRoutes = async () => {
        setLoading(true);
        try {
            const data = await routeService.getAll();
            setRoutes(data || []);
        } catch (error) {
            console.error("Error cargando rutas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const addRoute = async (newRoute) => {
        try {
            const added = await routeService.create(newRoute);
            setRoutes([...routes, added || { ...newRoute, id: Date.now().toString() }]);
            return { success: true };
        } catch (error) {
            console.error("Error creando ruta:", error);
            return { success: false, error: "Error al crear la ruta" };
        }
    };

    const updateRoute = async (updatedRoute) => {
        try {
            const updated = await routeService.update(updatedRoute.id, updatedRoute);
            setRoutes(routes.map(r => r.id === updatedRoute.id ? (updated || updatedRoute) : r));
            return { success: true };
        } catch (error) {
            console.error("Error actualizando ruta:", error);
            return { success: false, error: "Error al actualizar la ruta" };
        }
    };

    const deleteRoute = async (id) => {
        try {
            await routeService.delete(id);
            setRoutes(prev => prev.filter(r => r.id !== id));
            return { success: true };
        } catch (error) {
            console.error("Error eliminando ruta:", error);
            return { success: false, error: "Error al eliminar la ruta" };
        }
    };

    return { routes, loading, addRoute, updateRoute, deleteRoute };
};