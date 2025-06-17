export const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // HH:MM format
};

export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-CO');
};

export const formatDateTime = (datetime) => {
    if (!datetime) return '';
    return new Date(datetime).toLocaleString('es-CO');
};

export const calculateTotalHours = (horasTeoricas, horasPracticas) => {
    return (horasTeoricas || 0) + (horasPracticas || 0);
};

export const validateHoursConsistency = (creditos, horasTeoricas, horasPracticas) => {
    const totalHoras = calculateTotalHours(horasTeoricas, horasPracticas);
    const expectedHours = creditos * 16;
    return totalHoras === expectedHours;
};

export const generateAsignaturaCode = (nombre) => {
    if (!nombre) return '';

    const words = nombre.split(' ').filter(word => word.length > 2);
    const code = words
        .map(word => word.substring(0, 2).toUpperCase())
        .join('')
        .substring(0, 6);

    return code + Math.floor(Math.random() * 100).toString().padStart(2, '0');
};

export const sortAsignaturas = (asignaturas, sortBy = 'nombre', order = 'asc') => {
    return [...asignaturas].sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        if (order === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
};

export const filterAsignaturas = (asignaturas, filters) => {
    return asignaturas.filter(asignatura => {
        const matchesSearch = !filters.search ||
            asignatura.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
            asignatura.codigo.toLowerCase().includes(filters.search.toLowerCase());

        const matchesStatus = !filters.status || filters.status === 'all' ||
            (filters.status === 'active' && asignatura.activa) ||
            (filters.status === 'inactive' && !asignatura.activa);

        const matchesSemester = !filters.semester ||
            asignatura.numeroSemestre?.toString() === filters.semester;

        const matchesCredits = !filters.credits ||
            asignatura.creditos?.toString() === filters.credits;

        return matchesSearch && matchesStatus && matchesSemester && matchesCredits;
    });
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};