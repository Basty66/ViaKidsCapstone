import { useState, useEffect, useMemo } from 'react';
import { studentService } from '../services/studentService';

export const useStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBusFilter, setSelectedBusFilter] = useState('Todos');
    const [estadoFilter, setEstadoFilter] = useState('Todos');

    useEffect(() => {
        let isMounted = true;
        studentService.getAll().then(data => {
            if (isMounted) { setStudents(data); setLoading(false); }
        });
        return () => { isMounted = false; };
    }, []);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const nombreSeguro = student.nombre || '';
            const matchesSearch = nombreSeguro.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBus = selectedBusFilter === 'Todos' || student.busId === selectedBusFilter || student.busPatente === selectedBusFilter;
            const matchesEstado = estadoFilter === 'Todos' || student.estado === estadoFilter;
            return matchesSearch && matchesBus && matchesEstado;
        });
    }, [students, searchTerm, selectedBusFilter, estadoFilter]);

    const addStudent = async (student) => {
        const res = await studentService.create(student);
        if (res.success) setStudents(p => [...p, res.data]);
        return res;
    };

    const updateStudent = async (student) => {
        const res = await studentService.update(student);
        if (res.success) setStudents(p => p.map(s => s.id === student.id ? res.data : s));
        return res;
    };

    const deleteStudent = async (id) => {
        const res = await studentService.delete(id);
        if (res.success) setStudents(p => p.filter(s => s.id !== id));
        return res;
    };

    const refreshStudents = async () => {
        setLoading(true);
        const data = await studentService.getAll();
        setStudents(data);
        setLoading(false);
    };

    return { students: filteredStudents, allStudents: students, loading, searchTerm, setSearchTerm, selectedBusFilter, setSelectedBusFilter, estadoFilter, setEstadoFilter, addStudent, updateStudent, deleteStudent, refreshStudents };
};
