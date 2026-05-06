import { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { useRoutes } from '../hooks/useRoutes';
import { useBuses } from '../hooks/useBuses';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Edit2, Trash2, Map, Plus } from 'lucide-react';

export const RouteManagement = () => {
    const { routes, loading, addRoute, updateRoute, deleteRoute } = useRoutes();
    const { allBuses } = useBuses();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', colegio: '', horario: '', busId: '', busPatente: '' });

    const openCreateModal = () => { setFormData({ nombre: '', colegio: '', horario: '', busId: '', busPatente: '' }); setIsCreateModalOpen(true); };

    const openEditModal = (row) => {
        setSelectedRoute(row);
        setFormData({ nombre: row.nombre || '', colegio: row.colegio || '', horario: row.horario || '', busId: row.busId || '', busPatente: row.busPatente || '' });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (row) => { setSelectedRoute(row); setIsDeleteModalOpen(true); };

    const handleCreate = async () => {
        if (!formData.nombre) return;
        await addRoute(formData);
        setIsCreateModalOpen(false);
        setFormData({ nombre: '', colegio: '', horario: '', busId: '', busPatente: '' });
    };

    const handleUpdate = async () => {
        if (!formData.nombre) return;
        await updateRoute({ ...selectedRoute, ...formData });
        setIsEditModalOpen(false);
    };

    const handleDelete = async () => {
        if (!selectedRoute) return;
        await deleteRoute(selectedRoute.id);
        setIsDeleteModalOpen(false);
    };

    const columns = [
        { header: 'NOMBRE RUTA', accessor: 'nombre' },
        { header: 'COLEGIO', accessor: 'colegio' },
        { header: 'HORARIO', accessor: 'horario' },
        { header: 'BUS ASIGNADO', render: (row) => { const bus = allBuses.find(b => b.id === row.busId); return bus ? <span className="text-blue-400 font-medium">{bus.patente}</span> : <span className="text-slate-500 italic">{row.busPatente || 'Sin asignar'}</span>; } },
    ];

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <Map className="text-blue-400" size={28} />
                    <h1 className="text-2xl font-bold text-white">Gestión de Rutas y Colegios</h1>
                </div>
                <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2">
                    <Plus size={20} /> Nueva Ruta
                </button>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Cargando rutas...</div>
            ) : (
                <DataTable title="Lista de Rutas Activas" columns={columns} data={routes} actions={(row) => (
                    <div className="flex justify-end gap-4">
                        <button onClick={() => openEditModal(row)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Editar"><Edit2 size={16} /></button>
                        <button onClick={() => openDeleteModal(row)} className="text-red-400 hover:text-red-300 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                )} />
            )}

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nueva Ruta">
                <div className="space-y-4">
                    <input placeholder="Nombre de la Ruta (Ej: Ruta Norte)" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input placeholder="Colegio Destino" value={formData.colegio} onChange={e => setFormData({ ...formData, colegio: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="time" placeholder="Horario" value={formData.horario} onChange={e => setFormData({ ...formData, horario: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <select value={formData.busId} onChange={e => { const bus = allBuses.find(b => b.id === e.target.value); setFormData({ ...formData, busId: e.target.value, busPatente: bus ? bus.patente : '' }); }} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none [&>option]:bg-slate-900">
                        <option value="">Seleccionar Bus...</option>
                        {allBuses.map(bus => (<option key={bus.id} value={bus.id}>{bus.patente} — {bus.conductor}</option>))}
                    </select>
                    <button onClick={handleCreate} className="w-full bg-blue-600 py-3 mt-4 rounded-xl text-white font-bold hover:bg-blue-700 transition-colors">Guardar Ruta</button>
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Ruta">
                <div className="space-y-4">
                    <input placeholder="Nombre de la Ruta" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input placeholder="Colegio Destino" value={formData.colegio} onChange={e => setFormData({ ...formData, colegio: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="time" value={formData.horario} onChange={e => setFormData({ ...formData, horario: e.target.value })} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <select value={formData.busId} onChange={e => { const bus = allBuses.find(b => b.id === e.target.value); setFormData({ ...formData, busId: e.target.value, busPatente: bus ? bus.patente : '' }); }} className="w-full bg-slate-900/50 p-3 rounded-xl text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none [&>option]:bg-slate-900">
                        <option value="">Seleccionar Bus...</option>
                        {allBuses.map(bus => (<option key={bus.id} value={bus.id}>{bus.patente} — {bus.conductor}</option>))}
                    </select>
                    <button onClick={handleUpdate} className="w-full bg-blue-600 py-3 mt-4 rounded-xl text-white font-bold hover:bg-blue-700 transition-colors">Actualizar Ruta</button>
                </div>
            </Modal>

            <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Eliminar Ruta" message={`¿Estás seguro que deseas eliminar la ruta "${selectedRoute?.nombre}"? Esta acción no se puede deshacer.`} />
        </DashboardLayout>
    );
};
