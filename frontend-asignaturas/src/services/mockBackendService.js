class MockBackendService {
    constructor() {
        this.users = [
            {
                id: 1,
                email: 'admin@cue.edu.co',
                password: 'admin123', // En producción, esto sería hasheado
                nombre: 'Administrador del Sistema',
                rol: 'administrador'
            },
            {
                id: 2,
                email: 'coordinador@cue.edu.co',
                password: 'coord123',
                nombre: 'Coordinador Académico',
                rol: 'coordinador'
            }
        ];

        this.asignaturas = [
            {
                id: 1,
                codigo: 'MAT101',
                nombre: 'Matemáticas I',
                descripcion: 'Fundamentos de matemáticas para ingeniería',
                creditos: 4,
                horasTeoricas: 48,
                horasPracticas: 16,
                activa: true,
                numeroSemestre: 1
            },
            {
                id: 2,
                codigo: 'FIS101',
                nombre: 'Física I',
                descripcion: 'Mecánica clásica y termodinámica',
                creditos: 4,
                horasTeoricas: 48,
                horasPracticas: 16,
                activa: true,
                numeroSemestre: 1
            },
            {
                id: 3,
                codigo: 'PROG101',
                nombre: 'Programación I',
                descripcion: 'Fundamentos de programación y algoritmos',
                creditos: 3,
                horasTeoricas: 32,
                horasPracticas: 16,
                activa: true,
                numeroSemestre: 1
            },
            {
                id: 4,
                codigo: 'MAT201',
                nombre: 'Matemáticas II',
                descripcion: 'Cálculo diferencial e integral',
                creditos: 4,
                horasTeoricas: 48,
                horasPracticas: 16,
                activa: true,
                numeroSemestre: 2
            }
        ];

        this.horarios = [
            {
                id: 1,
                asignaturaId: 1,
                dia: 'LUNES',
                horaInicio: '08:00',
                horaFin: '10:00',
                aula: 'A101',
                tipoClase: 'TEORICA',
                profesorId: 'PROF001',
                capacidad: 30,
                activo: true,
                asignatura: {
                    id: 1,
                    nombre: 'Matemáticas I',
                    codigo: 'MAT101'
                }
            }
        ];
    }

    // Simular delay de red
    delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== AUTENTICACIÓN ====================
    async login(credentials) {
        await this.delay(1000);

        const user = this.users.find(u =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error('Credenciales incorrectas');
        }

        const accessToken = `mock-token-${user.id}-${Date.now()}`;
        const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol
            }
        };
    }

    async logout() {
        await this.delay(300);
        return { success: true };
    }

    async refreshToken() {
        await this.delay(500);
        return {
            accessToken: `mock-token-refreshed-${Date.now()}`
        };
    }

    // ==================== ASIGNATURAS ====================
    async getAsignaturas(filters = {}) {
        await this.delay();

        let result = [...this.asignaturas];

        // Aplicar filtros
        if (filters.activa !== undefined) {
            result = result.filter(a => a.activa === filters.activa);
        }

        if (filters.creditos) {
            result = result.filter(a => a.creditos === parseInt(filters.creditos));
        }

        if (filters.numeroSemestre) {
            result = result.filter(a => a.numeroSemestre === parseInt(filters.numeroSemestre));
        }

        if (filters.nombre) {
            result = result.filter(a =>
                a.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) ||
                a.codigo.toLowerCase().includes(filters.codigo.toLowerCase())
            );
        }

        return result;
    }

    async getAsignaturaById(id) {
        await this.delay();
        const asignatura = this.asignaturas.find(a => a.id === parseInt(id));

        if (!asignatura) {
            throw new Error('Asignatura no encontrada');
        }

        return asignatura;
    }

    async createAsignatura(data) {
        await this.delay(800);

        // Verificar código único
        const exists = this.asignaturas.find(a => a.codigo === data.codigo);
        if (exists) {
            throw new Error('Ya existe una asignatura con este código');
        }

        const newAsignatura = {
            id: Math.max(...this.asignaturas.map(a => a.id)) + 1,
            ...data,
            activa: data.activa ?? true
        };

        this.asignaturas.push(newAsignatura);
        return newAsignatura;
    }

    async updateAsignatura(id, data) {
        await this.delay(600);

        const index = this.asignaturas.findIndex(a => a.id === parseInt(id));
        if (index === -1) {
            throw new Error('Asignatura no encontrada');
        }

        // Verificar código único (excluyendo la asignatura actual)
        if (data.codigo) {
            const exists = this.asignaturas.find(a =>
                a.codigo === data.codigo && a.id !== parseInt(id)
            );
            if (exists) {
                throw new Error('Ya existe una asignatura con este código');
            }
        }

        this.asignaturas[index] = { ...this.asignaturas[index], ...data };
        return this.asignaturas[index];
    }

    async deleteAsignatura(id) {
        await this.delay(400);

        const index = this.asignaturas.findIndex(a => a.id === parseInt(id));
        if (index === -1) {
            throw new Error('Asignatura no encontrada');
        }

        this.asignaturas.splice(index, 1);
        return { success: true };
    }

    async getAsignaturasActivas() {
        await this.delay();
        return this.asignaturas.filter(a => a.activa);
    }

    async getAsignaturasEstadisticas() {
        await this.delay();

        const total = this.asignaturas.length;
        const activas = this.asignaturas.filter(a => a.activa).length;
        const totalCreditos = this.asignaturas.reduce((sum, a) => sum + a.creditos, 0);

        return {
            total,
            activas,
            inactivas: total - activas,
            totalCreditos,
            promedioCreditos: total > 0 ? (totalCreditos / total).toFixed(1) : 0
        };
    }

    // ==================== HORARIOS ====================
    async getHorarios(filters = {}) {
        await this.delay();

        let result = [...this.horarios];

        if (filters.dia) {
            result = result.filter(h => h.dia === filters.dia);
        }

        if (filters.asignaturaId) {
            result = result.filter(h => h.asignaturaId === parseInt(filters.asignaturaId));
        }

        return result;
    }

    async getWeeklySchedule(filters = {}) {
        await this.delay();
        return this.horarios;
    }

    async createHorario(data) {
        await this.delay(800);

        // Verificar conflictos
        const conflict = this.horarios.find(h =>
            h.dia === data.dia &&
            h.aula === data.aula &&
            ((data.horaInicio >= h.horaInicio && data.horaInicio < h.horaFin) ||
                (data.horaFin > h.horaInicio && data.horaFin <= h.horaFin) ||
                (data.horaInicio <= h.horaInicio && data.horaFin >= h.horaFin))
        );

        if (conflict) {
            throw new Error('Conflicto de horario detectado en el aula especificada');
        }

        const newHorario = {
            id: Math.max(...this.horarios.map(h => h.id), 0) + 1,
            ...data,
            activo: data.activo ?? true
        };

        // Agregar información de la asignatura
        const asignatura = this.asignaturas.find(a => a.id === parseInt(data.asignaturaId));
        if (asignatura) {
            newHorario.asignatura = {
                id: asignatura.id,
                nombre: asignatura.nombre,
                codigo: asignatura.codigo
            };
        }

        this.horarios.push(newHorario);
        return newHorario;
    }

    async updateHorario(id, data) {
        await this.delay(600);

        const index = this.horarios.findIndex(h => h.id === parseInt(id));
        if (index === -1) {
            throw new Error('Horario no encontrado');
        }

        this.horarios[index] = { ...this.horarios[index], ...data };
        return this.horarios[index];
    }

    async deleteHorario(id) {
        await this.delay(400);

        const index = this.horarios.findIndex(h => h.id === parseInt(id));
        if (index === -1) {
            throw new Error('Horario no encontrado');
        }

        this.horarios.splice(index, 1);
        return { success: true };
    }

    // ==================== PENSUM ====================
    async getPlanesEstudio() {
        await this.delay();
        return [
            {
                id: 1,
                nombre: 'Plan de Estudios 2024',
                programa: 'Ingeniería de Software',
                facultad: 'Ingeniería',
                duracionSemestres: 10,
                creditosMinimos: 160,
                creditosMaximos: 180,
                modalidad: 'presencial',
                vigencia: 2024,
                activo: true
            }
        ];
    }

    async getMallaCurricular(planId) {
        await this.delay();
        return {
            id: planId,
            semestres: Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                numero: i + 1,
                asignaturas: i < 2 ? this.asignaturas.filter(a => a.numeroSemestre === i + 1) : [],
                creditos: i < 2 ? this.asignaturas
                    .filter(a => a.numeroSemestre === i + 1)
                    .reduce((sum, a) => sum + a.creditos, 0) : 0,
                observaciones: ''
            }))
        };
    }

    async getEstadisticasPensum(planId) {
        await this.delay();
        return {
            totalAsignaturas: this.asignaturas.length,
            totalSemestres: 10,
            totalCreditos: this.asignaturas.reduce((sum, a) => sum + a.creditos, 0),
            progresoCompletitud: 25
        };
    }

    // ==================== HEALTH CHECK ====================
    async checkHealth() {
        await this.delay(200);
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            responseTime: '200ms',
            service: 'mock-backend'
        };
    }
}

// Instancia singleton del servicio mock
const mockBackendService = new MockBackendService();

export default mockBackendService;