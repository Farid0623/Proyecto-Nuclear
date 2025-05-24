# Módulo de Asignaturas y Pensum - CUE

Sistema de gestión de asignaturas y pensum académico desarrollado con **Spring Boot**, **MongoDB** y patrones de diseño.

## Arquitectura del Proyecto

### Estructura de Paquetes
```
cue.edu.co.modulosasignaturas/
├── ModulosAsignaturasApplication.java     # Clase principal
├── model/                                 # Entidades del dominio
│   ├── Asignatura.java                   # Entidad principal
│   ├── PlanEstudios.java                 # Plan de estudios
│   ├── Semestre.java                     # Semestre académico
│   ├── Estudiante.java                   # Estudiante (Observer)
│   ├── Horario.java                      # Horarios de clases
│   ├── AsignaturaMatriculada.java        # Matrícula de asignatura
│   ├── EstadoMatricula.java              # Estados de matrícula
│   ├── ComponentePlan.java               # Interfaz Composite
│   └── state/                            # Patrón State
│       ├── EstadoAsignatura.java         # Interfaz Estado
│       ├── AsignaturaActiva.java         # Estado Activo
│       └── AsignaturaInactiva.java       # Estado Inactivo
├── factory/                              # Patrón Factory Method
│   ├── AsignaturaFactory.java            # Interfaz Factory
│   └── AsignaturaFactoryImpl.java        # Implementación Factory
├── builder/                              # Patrón Builder
│   ├── PlanEstudiosBuilder.java          # Builder de planes
│   ├── DirectorPlanEstudios.java         # Director del Builder
│   └── ConfiguracionPlan.java            # Configuración
├── singleton/                            # Patrón Singleton
│   └── Administrador.java                # Administrador único
├── observer/                             # Patrón Observer
│   ├── Observer.java                     # Interfaz Observer
│   ├── Sujeto.java                       # Interfaz Subject
│   ├── Pensum.java                       # Subject concreto
│   ├── Profesor.java                     # Observer concreto
│   └── TipoCambio.java                   # Tipos de cambio
├── strategy/                             # Patrón Strategy
│   ├── EstrategiaAsignacion.java         # Interfaz Strategy
│   └── AsignacionOptimizada.java         # Estrategia concreta
├── validation/                           # Chain of Responsibility
│   ├── ManejadorValidacion.java          # Interfaz Handler
│   ├── ManejadorBase.java                # Handler base
│   ├── SolicitudValidacion.java          # Request object
│   ├── ValidarCreditos.java              # Validador específico
│   ├── ValidarCodigoAsignatura.java      # Validador específico
│   └── ValidarHorasCreditos.java         # Validador específico
├── service/                              # Servicios de negocio
│   ├── AsignaturaService.java            # Servicio principal
│   ├── ServicioValidacion.java           # Coordinador de validaciones
│   └── GestorHorarios.java               # Gestor con Strategy
├── repository/                           # Repositorios MongoDB
│   ├── AsignaturaRepository.java         # Repositorio Asignatura
│   ├── PlanEstudiosRepository.java       # Repositorio PlanEstudios
│   └── SemestreRepository.java           # Repositorio Semestre
└── controller/                           # Controladores REST
    └── AsignaturaController.java         # API REST
```

## Reglas OCL Implementadas

### Asignatura
- **creditosPositivos**: `self.creditos > 0`
- **horasConsistentes**: `self.horasTeoricas + self.horasPracticas = self.creditos * 16`
- **codigoValido**: `self.codigo.size() >= 3 and self.codigo.size() <= 10`
- **noAutoPrerrequisito**: `not self.prerrequisito->includes(self)`
- **asignaturaInactivaNoAsignable**: `not self.activa implies self.horario->isEmpty()`

### PlanEstudios
- **duracionValida**: `self.duracionSemestres >= 8 and self.duracionSemestres <= 12`
- **tieneSemestres**: `self.semestre->notEmpty()`
- **semestreUnico**: Números únicos por semestre
- **creditosTotalesValidos**: `<= 200 créditos totales`

### Semestre
- **numeroValido**: `self.numero > 0 and self.numero <= self.planEstudios.duracionSemestres`
- **tieneAsignaturas**: `self.asignatura->notEmpty()`
- **creditosPorSemestreValidos**: `12 <= créditos <= 20`

### Estudiante
- **cumplePrerequisitos**: Validación de prerrequisitos aprobados
- **noConflictoHorario**: Sin solapamiento de horarios

##  Patrones de Diseño Implementados

### Creacionales
- **Factory Method**: Creación validada de asignaturas
- **Builder**: Construcción paso a paso de planes de estudio
- **Singleton**: Administrador único del sistema

### Estructurales
- **Composite**: Jerarquía PlanEstudios → Semestre → Asignatura
- **Decorator**: Etiquetas dinámicas para asignaturas

### Comportamiento
- **Observer**: Notificaciones de cambios en pensum
- **Strategy**: Diferentes algoritmos de asignación de horarios
- **State**: Estados de asignaturas (activa/inactiva)
- **Chain of Responsibility**: Validaciones OCL en cadena

## Tecnologías

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data MongoDB**
- **MongoDB**
- **Maven**
- **Lombok**
- **Validation API**
- **Swagger/OpenAPI**

##  Configuración y Ejecución

### 1. Prerrequisitos
```bash
# Instalar Java 17
# Instalar Maven 3.8+
# Instalar MongoDB o usar MongoDB Atlas
```

### 2. Configuración MongoDB
```yaml
# application.yml
spring:
  data:
    mongodb:
      host: localhost
      port: 27017
      database: pensum_db
      # Para MongoDB Atlas:
      # uri: mongodb+srv://user:password@cluster.mongodb.net/pensum_db
```

### 3. Compilar y Ejecutar
```bash
# Clonar el proyecto
git clone <repository-url>
cd modulosasignaturas

# Compilar
mvn clean compile

# Ejecutar tests
mvn test

# Ejecutar aplicación
mvn spring-boot:run

# O compilar JAR y ejecutar
mvn clean package
java -jar target/asignaturas-pensum-0.0.1-SNAPSHOT.jar
```

### 4. Acceder a la aplicación
- **API REST**: `http://localhost:8080/api/asignaturas`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/api-docs`

##  Uso de la API

### Ejemplos de endpoints:

```bash
# Crear asignatura
POST /api/asignaturas
{
  "codigo": "MAT101",
  "nombre": "Matemáticas I",
  "creditos": 4,
  "horasTeoricas": 48,
  "horasPracticas": 16,
  "descripcion": "Fundamentos de matemáticas",
  "activa": true
}

# Obtener todas las asignaturas
GET /api/asignaturas

# Buscar por código
GET /api/asignaturas/codigo/MAT101

# Validar datos
POST /api/asignaturas/validar
{
  "codigo": "FIS101",
  "nombre": "Física I",
  "creditos": 4,
  "horasTeoricas": 48,
  "horasPracticas": 16
}

# Cambiar estado
PATCH /api/asignaturas/{id}/estado?activa=false
```

##  Testing

### Ejecutar tests
```bash
# Todos los tests
mvn test

# Tests específicos
mvn test -Dtest=AsignaturaServiceTest
mvn test -Dtest=*ValidationTest
```

### Tests implementados
- Tests unitarios para servicios
- Tests de integración con MongoDB embebido
- Tests de validaciones OCL
- Tests de patrones de diseño

##  Logs

### Configuración de logging
```yaml
logging:
  level:
    cue.edu.co.modulosasignaturas: DEBUG
    org.springframework.data.mongodb: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
```

## Validaciones

El sistema implementa validaciones a múltiples niveles:
1. **Bean Validation**: Anotaciones Jakarta Validation
2. **Reglas OCL**: Validaciones de dominio específicas
3. **Chain of Responsibility**: Validaciones en cadena
4. **Base de datos**: Índices únicos y restricciones

##  Características Destacadas

-  **Reglas OCL completas** implementadas y validadas
-  **8 patrones de diseño** correctamente aplicados
-  **API REST completa** con documentación Swagger
-  **Persistencia MongoDB** con repositorios optimizados
-  **Arquitectura modular** y extensible
-  **Logging detallado** para debugging
-  **Validaciones robustas** en múltiples capas
-  **Observer pattern** para notificaciones en tiempo real

## Soporte

Para dudas o problemas:
- Revisar logs en `logs/application.log`
- Verificar configuración de MongoDB
- Consultar documentación de Spring Boot
- Revisar tests unitarios como ejemplos de uso

---

**Desarrollado por**: Faridd Santiago Martinez Sanchez  
**Curso**: Análisis y Diseño - Semestre IV  
**Institución**: CUE - Armenia, Quindío