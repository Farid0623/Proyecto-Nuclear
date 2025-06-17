// =================================================================
// Inicialización de MongoDB para Docker
// Este script se ejecuta automáticamente cuando MongoDB inicia
// =================================================================

print('🚀 Iniciando configuración de MongoDB para Módulo de Asignaturas...');

// Seleccionar la base de datos
db = db.getSiblingDB('modulo_asignaturas');

print('📂 Base de datos seleccionada: modulo_asignaturas');

// =================================================================
// Crear usuario para la aplicación
// =================================================================
try {
    db.createUser({
        user: 'app_user',
        pwd: 'app_password_123',
        roles: [
            {
                role: 'readWrite',
                db: 'modulo_asignaturas'
            }
        ]
    });
    print('✅ Usuario de aplicación creado: app_user');
} catch (e) {
    print('⚠️ Usuario ya existe o error: ' + e.message);
}

// =================================================================
// Crear colecciones principales
// =================================================================
print('📋 Creando colecciones...');

// Crear colecciones con validación
db.createCollection('usuarios', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["username", "email", "role"],
            properties: {
                username: {
                    bsonType: "string",
                    description: "Username debe ser string y es requerido"
                },
                email: {
                    bsonType: "string",
                    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
                    description: "Email debe tener formato válido"
                },
                role: {
                    enum: ["ADMINISTRADOR", "COORDINADOR", "PROFESOR", "ALUMNO"],
                    description: "Role debe ser uno de los valores permitidos"
                }
            }
        }
    }
});

db.createCollection('asignaturas', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["codigo", "nombre"],
            properties: {
                codigo: {
                    bsonType: "string",
                    description: "Código de asignatura requerido"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre de asignatura requerido"
                },
                creditos: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 10,
                    description: "Créditos debe estar entre 1 y 10"
                }
            }
        }
    }
});

db.createCollection('estudiantes');
db.createCollection('planes_estudios');
db.createCollection('horarios');

print('✅ Colecciones creadas: usuarios, asignaturas, estudiantes, planes_estudios, horarios');

// =================================================================
// Crear índices únicos y optimizaciones
// =================================================================
print('🔍 Creando índices...');

// Índices para usuarios
db.usuarios.createIndex({ "username": 1 }, { unique: true, name: "idx_unique_username" });
db.usuarios.createIndex({ "email": 1 }, { unique: true, name: "idx_unique_email" });
db.usuarios.createIndex({ "role": 1 }, { name: "idx_role" });
db.usuarios.createIndex({ "enabled": 1 }, { name: "idx_enabled" });

// Índices para asignaturas
db.asignaturas.createIndex({ "codigo": 1 }, { unique: true, name: "idx_unique_codigo_asignatura" });
db.asignaturas.createIndex({ "nombre": 1 }, { name: "idx_nombre_asignatura" });
db.asignaturas.createIndex({ "activa": 1 }, { name: "idx_activa" });
db.asignaturas.createIndex({ "creditos": 1 }, { name: "idx_creditos" });

// Índices para estudiantes
db.estudiantes.createIndex({ "codigoEstudiantil": 1 }, { unique: true, name: "idx_unique_codigo_estudiantil" });
db.estudiantes.createIndex({ "email": 1 }, { unique: true, name: "idx_unique_email_estudiante" });
db.estudiantes.createIndex({ "semestreActual": 1 }, { name: "idx_semestre_actual" });
db.estudiantes.createIndex({ "planEstudiosId": 1 }, { name: "idx_plan_estudios" });

// Índices para planes de estudios
db.planes_estudios.createIndex({ "codigo": 1 }, { unique: true, name: "idx_unique_codigo_plan" });
db.planes_estudios.createIndex({ "facultad": 1 }, { name: "idx_facultad" });
db.planes_estudios.createIndex({ "activo": 1 }, { name: "idx_plan_activo" });

// Índices para horarios
db.horarios.createIndex({ "asignaturaId": 1 }, { name: "idx_asignatura_horario" });
db.horarios.createIndex({ "profesorId": 1 }, { name: "idx_profesor_horario" });
db.horarios.createIndex({ "aula": 1 }, { name: "idx_aula" });
db.horarios.createIndex({ "diaSemana": 1 }, { name: "idx_dia_semana" });
db.horarios.createIndex({ "semestre": 1, "año": 1 }, { name: "idx_periodo" });

print('✅ Índices creados para optimización de consultas');

// =================================================================
// Insertar datos de ejemplo
// =================================================================
print('📝 Insertando datos de ejemplo...');

// Insertar usuario administrador de ejemplo
// Nota: La contraseña se encriptará por la aplicación Spring Boot
db.usuarios.insertOne({
    username: 'docker_admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', // password
    email: 'admin@docker.universidad.edu.co',
    nombre: 'Admin',
    apellido: 'Docker',
    role: 'ADMINISTRADOR',
    enabled: true,
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    createdAt: new Date()
});

// Insertar asignaturas de ejemplo
db.asignaturas.insertMany([
    {
        codigo: 'DOCKER101',
        nombre: 'Introducción a Docker',
        creditos: 3,
        horasTeoricas: 2,
        horasPracticas: 1,
        descripcion: 'Curso introductorio a containerización con Docker',
        activa: true,
        semestre: '1',
        createdAt: new Date()
    },
    {
        codigo: 'SPRING201',
        nombre: 'Spring Boot Avanzado',
        creditos: 4,
        horasTeoricas: 3,
        horasPracticas: 1,
        descripcion: 'Desarrollo avanzado con Spring Boot',
        activa: true,
        semestre: '2',
        createdAt: new Date()
    },
    {
        codigo: 'MONGO301',
        nombre: 'MongoDB y NoSQL',
        creditos: 3,
        horasTeoricas: 2,
        horasPracticas: 1,
        descripcion: 'Bases de datos NoSQL con MongoDB',
        activa: true,
        semestre: '3',
        createdAt: new Date()
    }
]);

// Insertar plan de estudios de ejemplo
db.planes_estudios.insertOne({
    codigo: 'DOCKER2024',
    nombrePrograma: 'Ingeniería de Software - Docker Edition',
    facultad: 'Facultad de Ingeniería',
    duracionSemestres: 8,
    creditosTotales: 144,
    descripcion: 'Plan de estudios modernizado con tecnologías de containerización',
    activo: true,
    fechaCreacion: new Date(),
    fechaVigencia: new Date(),
    estructuraCurricular: {
        '1': ['DOCKER101'],
        '2': ['SPRING201'],
        '3': ['MONGO301']
    }
});

print('✅ Datos de ejemplo insertados correctamente');

// =================================================================
// Verificar configuración
// =================================================================
print('🔍 Verificando configuración...');

print('👥 Usuarios en la base de datos: ' + db.usuarios.countDocuments());
print('📚 Asignaturas en la base de datos: ' + db.asignaturas.countDocuments());
print('📋 Planes de estudios en la base de datos: ' + db.planes_estudios.countDocuments());

// Listar colecciones creadas
print('📂 Colecciones disponibles:');
db.getCollectionNames().forEach(function(collection) {
    print('  - ' + collection);
});

// =================================================================
// Configuración finalizada
// =================================================================
print('');
print('🎉 ¡Configuración de MongoDB completada exitosamente!');
print('');
print('📊 Resumen:');
print('  ✅ Base de datos: modulo_asignaturas');
print('  ✅ Usuario aplicación: app_user');
print('  ✅ Colecciones: 5 creadas');
print('  ✅ Índices: Optimizados para consultas');
print('  ✅ Datos ejemplo: Usuarios, asignaturas y plan de estudios');
print('');
print('🔑 Credenciales de prueba:');
print('  - Usuario Docker Admin: docker_admin / password');
print('');
print('🚀 La aplicación Spring Boot puede conectarse ahora!');