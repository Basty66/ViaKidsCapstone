import { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { QrCode, Search, Printer } from 'lucide-react';
import { QRCodeGenerator } from '../components/ui/QRCodeGenerator';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { useStudents } from '../hooks/useStudents';
import { useToast } from '../context/ToastContext';

export const StudentQRViewer = () => {
    const { students, loading, searchTerm, setSearchTerm } = useStudents();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const toast = useToast();

    const filteredStudents = students.filter(s => s.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass p-6 rounded-3xl gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                            <QrCode className="text-purple-400" /> Códigos QR
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Genera y gestiona los QR para control de abordaje</p>
                    </div>
                    <button onClick={() => { toast.info('Preparando para imprimir...'); setTimeout(() => window.print(), 500); }} className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all btn-ripple">
                        <Printer size={18} /> Imprimir Todos
                    </button>
                </div>

                <div className="flex items-center gap-3 glass p-4 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <Search className="text-white/50 ml-3 shrink-0" size={18} />
                    <input type="text" placeholder="Buscar estudiante..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-sm" />
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="glass rounded-2xl p-6 skeleton-base h-56" />
                        ))}
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <EmptyState icon={<QrCode size={40} className="text-slate-500" />} title="Sin resultados" description="No se encontraron estudiantes con ese nombre" />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredStudents.map((student, i) => (
                            <div key={student.id} className="glass rounded-2xl p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => setSelectedStudent(student)}>
                                <QRCodeGenerator studentData={student} size={120} />
                                <div className="text-center">
                                    <p className="text-white font-bold text-sm truncate max-w-[150px]">{student.nombre}</p>
                                    <p className="text-slate-400 text-xs">{student.curso}</p>
                                    <p className="text-blue-400 text-xs">{student.busPatente || 'Sin bus'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Código QR — Vista Completa">
                {selectedStudent && (
                    <div className="space-y-6">
                        <QRCodeGenerator studentData={selectedStudent} size={250} />
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 space-y-2 text-sm">
                            <p className="text-white font-bold text-lg">{selectedStudent.nombre}</p>
                            <p className="text-slate-400">RUT: {selectedStudent.rut || 'N/A'}</p>
                            <p className="text-slate-400">Curso: {selectedStudent.curso}</p>
                            <p className="text-slate-400">Bus: {selectedStudent.busPatente || 'Sin asignar'}</p>
                            <p className="text-slate-400">Ruta: {selectedStudent.ruta || 'Sin asignar'}</p>
                            <p className="text-slate-400">Apoderado: {selectedStudent.apoderado || 'N/A'}</p>
                            <p className="text-slate-400">Teléfono: {selectedStudent.telefono || 'N/A'}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};
