import { useState, useEffect, useMemo } from 'react';
import { busService } from '../services/busService';

export const useBuses = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let isMounted = true;
        busService.getAll().then(data => {
            if (isMounted) { setBuses(data); setLoading(false); }
        });
        return () => { isMounted = false; };
    }, []);

    const isPatenteDuplicada = (patente, idExcluido = null) => {
        return buses.some(bus => bus.patente.toUpperCase() === patente.toUpperCase() && bus.id !== idExcluido);
    };

    const filteredBuses = useMemo(() => {
        let result = buses;
        if (filter !== 'Todos') result = result.filter(bus => bus.estado === filter);
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(bus => bus.patente.toLowerCase().includes(lowerTerm) || (bus.conductor && bus.conductor.toLowerCase().includes(lowerTerm)));
        }
        return result;
    }, [buses, filter, searchTerm]);

    const addBus = async (newBus) => { const res = await busService.create(newBus); if (res.success) setBuses(p => [...p, res.data]); return res; };
    const updateBus = async (updatedBus) => { const res = await busService.update(updatedBus); if (res.success) setBuses(p => p.map(b => b.id === updatedBus.id ? res.data : b)); return res; };
    const deleteBus = async (id) => { const res = await busService.delete(id); if (res.success) setBuses(p => p.filter(b => b.id !== id)); return res; };

    const validateForm = (data, editingId = null) => {
        if (!data.patente?.trim() || !data.conductor?.trim()) return 'La patente y el conductor son obligatorios.';
        if (data.patente.length < 5) return 'La patente es muy corta (mínimo 5 caracteres).';
        if (isPatenteDuplicada(data.patente, editingId)) return 'Esta patente ya está registrada.';
        return null;
    };

    return { buses: filteredBuses, allBuses: buses, loading, filter, setFilter, searchTerm, setSearchTerm, addBus, updateBus, deleteBus, validateForm, isPatenteDuplicada };
};
