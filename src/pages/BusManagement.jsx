import { useState } from 'react';
import * as XLSX from 'xlsx';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge'; // Importamos el componente de estado visual
import { useBuses } from '../hooks/useBuses';
import { Plus, Search, Edit2, Trash2, AlertCircle, Download, Bus } from 'lucide-react';

export const BusManagement = () => {
    const {
        buses, loading, filter, setFilter, searchTerm, setSearchTerm,
        addBus, updateBus, deleteBus, validateForm
    } = useBuses();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBus, setEditingBus] = useState(null);
    const [newBus, setNewBus] = useState({ patente: '', conductor: '', capacidad: '', estado: 'Activo' });
    const [error, setError] = useState("");

    const handleOpenModal = (bus = null) => {
        setError("");
        if (bus) {
            setEditingBus(bus);
            setNewBus(bus);
        } else {
            setEditingBus(null);
            setNewBus({ patente: '', conductor: '', capacidad: '', estado: 'Activo' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        const validationError = validateForm(newBus, editingBus?.id);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (editingBus) {
            await updateBus(newBus);
        } else {
            await addBus(newBus);
        }

        setIsModalOpen(false);
        setEditingBus(null);
        setNewBus({ patente: '', conductor: '', capacidad: '', estado: 'Activo' });
    };

    const exportToExcel = () => {
        const dataToExport = buses.map(bus => ({
            Patente: bus.patente,
            Conductor: bus.conductor,
            Capacidad: bus.capacidad,
            Estado: bus.estado
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Flota");
        XLSX.writeFile(workbook, "Flota_de_Buses.xlsx");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-center backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Bus /> Gestión de Flota</h1>
                    <div className="flex gap-3">
                        <button onClick={exportToExcel} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10">
                            <Download size={20} /> Exportar
                        </button>
                        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                            <Plus size={20} /> Nuevo Bus
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                    <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-white/5 w-full md:w-64">
                        <Search className="text-white/50" size={18} />
                        <input type="text" placeholder="Buscar patente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-sm" />
                    </div>

                    <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                        {["Todos", "Activo", "Mantenimiento", "Fuera de Servicio"].map((st) => (
                            <button key={st} onClick={() => setFilter(st)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === st ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                {st}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                {!loading && (
                    <DataTable
                        title="Buses Disponibles"
                        columns={[
                            { header: 'Patente', accessor: 'patente' },
                            { header: 'Conductor', accessor: 'conductor' },
                            { header: 'Capacidad', accessor: 'capacidad' },
                            {
                                header: 'Estado',
                                accessor: 'estado',
                                render: (row) => <Badge status={row.estado}>{row.estado}</Badge>
                            }
                        ]}
                        data={buses}
                        actions={(row) => (
                            <div className="flex justify-end gap-2">
                                <button onClick={() => handleOpenModal(row)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"><Edit2 size={16} /></button>
                                <button onClick={() => deleteBus(row.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        )}
                    />
                )}
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBus ? "Editar Bus" : "Registrar Bus"}>
                <div className="space-y-4">
                    {error && <div className="text-red-400 flex items-center gap-2 text-sm bg-red-500/10 p-3 rounded-xl"><AlertCircle size={16} /> {error}</div>}
                    <div>
                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Patente</label>
                        <input className="w-full bg-slate-900 p-3 rounded-xl text-white border border-white/10" value={newBus.patente} onChange={e => setNewBus({ ...newBus, patente: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Conductor</label>
                        <input className="w-full bg-slate-900 p-3 rounded-xl text-white border border-white/10" value={newBus.conductor} onChange={e => setNewBus({ ...newBus, conductor: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Capacidad</label>
                        <input type="number" className="w-full bg-slate-900 p-3 rounded-xl text-white border border-white/10" value={newBus.capacidad} onChange={e => setNewBus({ ...newBus, capacidad: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Estado</label>
                        <select className="w-full bg-slate-900 p-3 rounded-xl text-white border border-white/10" value={newBus.estado} onChange={e => setNewBus({ ...newBus, estado: e.target.value })}>
                            <option>Activo</option>
                            <option>Mantenimiento</option>
                            <option>Fuera de Servicio</option>
                        </select>
                    </div>
                    <button onClick={handleSave} className="w-full bg-blue-600 py-3 rounded-xl text-white font-bold hover:bg-blue-700 transition-all shadow-lg mt-2">
                        {editingBus ? "Actualizar Bus" : "Guardar Bus"}
                    </button>
                </div>
            </Modal>
        </DashboardLayout>
    );
};