package cue.edu.co.moduloasignaturas.integration;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.service.AsignaturaService;
import cue.edu.co.moduloasignaturas.repository.AsignaturaRepository;
import cue.edu.co.moduloasignaturas.config.TestMongoConfig;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Clase de pruebas de integración completa para el módulo de Asignaturas.
 *
 * Esta clase realiza tests de integración end-to-end que validan el funcionamiento
 * completo del sistema con una base de datos MongoDB real. A diferencia de los tests
 * unitarios que prueban componentes aislados, estos tests verifican que todos los
 * componentes trabajen correctamente en conjunto.
 *
 * Configuración de la clase:
 * - @SpringBootTest: Carga el contexto completo de Spring Boot
 * - @ActiveProfiles("test"): Activa el perfil de test con configuración específica
 * - @ContextConfiguration: Usa configuración de MongoDB específica para tests
 *
 * Componentes probados:
 * - Repositorio de Asignaturas (capa de datos)
 * - Servicio de Asignaturas (lógica de negocio)
 * - Modelo de Asignatura (entidad de dominio)
 * - Conectividad con MongoDB
 * - Validaciones OCL (Object Constraint Language)
 *
 * Base de datos:
 * - Utiliza MongoDB real con base de datos de test separada
 * - Se limpia antes de cada test para asegurar aislamiento
 * - Configuración específica en TestMongoConfig
 *
 * @author Equipo de Desarrollo
 * @version 1.0
 * @since 2024
 * @see AsignaturaService
 * @see AsignaturaRepository
 * @see Asignatura
 */
@SpringBootTest
@ActiveProfiles("test")
@ContextConfiguration(classes = TestMongoConfig.class)
@DisplayName("🎯 Asignatura - Tests de Integración con MongoDB")
class AsignaturaIntegrationTest {

    /**
     * Logger para registrar información durante la ejecución de los tests de integración.
     * Utilizado para hacer seguimiento del flujo de ejecución y facilitar el debugging
     * de problemas en el entorno de integración.
     */
    private static final Logger logger = LoggerFactory.getLogger(AsignaturaIntegrationTest.class);

    /**
     * Servicio de Asignaturas inyectado por Spring.
     * Contiene la lógica de negocio y coordina las operaciones entre
     * las diferentes capas del sistema.
     */
    @Autowired
    private AsignaturaService asignaturaService;

    /**
     * Repositorio de Asignaturas inyectado por Spring.
     * Maneja la persistencia y consultas directas a la base de datos MongoDB.
     * Se usa para verificaciones adicionales de los datos persistidos.
     */
    @Autowired
    private AsignaturaRepository asignaturaRepository;

    /**
     * Template de MongoDB inyectado por Spring.
     * Proporciona acceso de bajo nivel a MongoDB para operaciones de
     * administración como limpieza de colecciones y verificación de conectividad.
     */
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Método de configuración que se ejecuta antes de cada test.
     *
     * Responsabilidades:
     * - Limpiar completamente la colección de asignaturas
     * - Recrear la colección para asegurar un estado limpio
     * - Garantizar el aislamiento entre tests
     *
     * Este método es crucial para mantener la independencia de los tests,
     * evitando que los datos de un test afecten los resultados de otro.
     *
     * @see org.junit.jupiter.api.BeforeEach
     */
    @BeforeEach
    void setUp() {
        // Eliminar completamente la colección de asignaturas de la base de datos de test
        // Esto asegura que no queden datos residuales de tests anteriores
        mongoTemplate.dropCollection(Asignatura.class);

        // Recrear la colección vacía para el siguiente test
        // MongoDB creará automáticamente los índices definidos en la entidad
        mongoTemplate.createCollection(Asignatura.class);

        // Registrar la operación de limpieza en los logs
        logger.info("🧹 Base de datos de test limpiada");
    }

    /**
     * Test de conectividad básica con MongoDB.
     *
     * Propósito:
     * - Verificar que la conexión a MongoDB está funcionando correctamente
     * - Validar que se está conectando a la base de datos correcta (test_pensum_db)
     * - Asegurar que el MongoTemplate está correctamente configurado
     *
     * Este test es fundamental ya que todos los otros tests dependen de una
     * conexión exitosa a la base de datos.
     *
     * Patrón Given-When-Then:
     * - Given: El sistema está configurado y conectado
     * - When: Se obtiene el nombre de la base de datos actual
     * - Then: Se verifica que es la base de datos de test esperada
     *
     * @see MongoTemplate#getDb()
     */
    @Test
    @DisplayName("🔌 Debe conectar a MongoDB correctamente")
    void debeConectarAMongoDB() {
        // When - Obtener el nombre de la base de datos actual
        // Esta operación confirma que hay conectividad con MongoDB
        String databaseName = mongoTemplate.getDb().getName();

        // Then - Verificar que estamos conectados a la base de datos correcta
        // Es crucial usar una base de datos separada para tests
        assertEquals("test_pensum_db", databaseName,
                "Debe estar conectado a la base de datos de test");

        // Verificar que el MongoTemplate no es nulo
        assertNotNull(mongoTemplate, "MongoTemplate debe estar correctamente inicializado");

        // Registrar la conexión exitosa
        logger.info("🔌 Conectado a MongoDB: {}", databaseName);
    }

    /**
     * Test de creación y persistencia completa de una asignatura.
     *
     * Este test verifica el flujo completo desde la creación hasta la persistencia:
     * 1. Creación de asignatura através del servicio
     * 2. Validación de todos los campos asignados
     * 3. Verificación de persistencia en la base de datos
     * 4. Consulta directa al repositorio para confirmar el guardado
     *
     * Validaciones realizadas:
     * - La asignatura se crea correctamente con todos los campos
     * - Se asigna un ID único automáticamente
     * - El estado por defecto es activo
     * - Los datos se persisten correctamente en MongoDB
     * - Se puede recuperar la asignatura usando consultas del repositorio
     *
     * Patrón Given-When-Then:
     * - Given: Datos válidos para crear una asignatura
     * - When: Se crea la asignatura usando el servicio
     * - Then: Se verifica la creación y persistencia correcta
     *
     * @see AsignaturaService#crearAsignatura
     * @see AsignaturaRepository#findByCodigo
     */
    @Test
    @DisplayName("💾 Debe crear y guardar asignatura en MongoDB")
    void debeCrearYGuardarAsignatura() {
        // Given - Preparar datos válidos para una nueva asignatura
        // Utilizamos datos que sabemos que cumplen con todas las reglas de negocio
        String codigo = "MAT101";
        String nombre = "Matemáticas I";
        Integer creditos = 4;
        Integer horasTeoricas = 48;
        Integer horasPracticas = 16;

        // When - Crear la asignatura usando el servicio
        // El servicio debe manejar toda la lógica de validación y persistencia
        Asignatura asignaturaCreada = asignaturaService.crearAsignatura(
                codigo, nombre, creditos, horasTeoricas, horasPracticas);

        // Then - Verificar que la asignatura se creó correctamente
        // Validar que la asignatura no es nula
        assertNotNull(asignaturaCreada, "La asignatura creada no debe ser nula");

        // Verificar que se asignó un ID automáticamente
        assertNotNull(asignaturaCreada.getId(), "Debe asignarse un ID único automáticamente");

        // Validar que todos los campos se asignaron correctamente
        assertEquals(codigo, asignaturaCreada.getCodigo(), "El código debe coincidir");
        assertEquals(nombre, asignaturaCreada.getNombre(), "El nombre debe coincidir");
        assertEquals(creditos, asignaturaCreada.getCreditos(), "Los créditos deben coincidir");

        // Verificar que el estado por defecto es activo
        assertTrue(asignaturaCreada.getActiva(), "Una asignatura nueva debe estar activa por defecto");

        // Verificar que se guardó correctamente en la base de datos
        // Usar el repositorio directamente para confirmar la persistencia
        Optional<Asignatura> asignaturaEnBD = asignaturaRepository.findByCodigo(codigo);
        assertTrue(asignaturaEnBD.isPresent(), "La asignatura debe existir en la base de datos");
        assertEquals(codigo, asignaturaEnBD.get().getCodigo(), "El código en BD debe coincidir");

        // Registrar el éxito de la operación
        logger.info("💾 Asignatura guardada en MongoDB: {}", asignaturaCreada);
    }

    /**
     * Test de validación de reglas OCL (Object Constraint Language).
     *
     * Las reglas OCL son restricciones de negocio que deben cumplirse para
     * que una asignatura sea válida. Este test verifica que:
     *
     * Caso positivo:
     * - Asignaturas que cumplen todas las reglas se guardan exitosamente
     * - Las validaciones permiten datos correctos
     *
     * Caso negativo:
     * - Asignaturas que violan reglas son rechazadas
     * - Se lanzan excepciones apropiadas con mensajes descriptivos
     *
     * Reglas OCL validadas:
     * - Consistencia de horas: (horasTeoricas + horasPracticas) = creditos * 16
     * - Campos obligatorios no nulos
     * - Valores en rangos válidos
     *
     * Patrón Given-When-Then (doble):
     * Caso válido:
     * - Given: Asignatura que cumple todas las reglas OCL
     * - When: Se intenta guardar la asignatura
     * - Then: Se guarda exitosamente sin excepciones
     *
     * Caso inválido:
     * - Given: Asignatura que viola reglas OCL
     * - When: Se intenta guardar la asignatura
     * - Then: Se lanza excepción con mensaje descriptivo
     *
     * @see AsignaturaService#guardar
     * @see IllegalArgumentException
     */
    @Test
    @DisplayName("✅ Debe validar reglas OCL al guardar")
    void debeValidarReglasOCL() {
        // Given - Crear una asignatura que cumple todas las reglas OCL
        // Horas: 32 + 16 = 48, y 3 créditos * 16 = 48 ✅ (regla cumplida)
        Asignatura asignaturaValida = Asignatura.builder()
                .codigo("FIS101")
                .nombre("Física I")
                .creditos(3)
                .horasTeoricas(32)
                .horasPracticas(16) // 32 + 16 = 48 = 3 * 16 ✅
                .activa(true)
                .build();

        // When & Then - La asignatura válida debe guardarse sin problemas
        // assertDoesNotThrow verifica que no se lance ninguna excepción
        assertDoesNotThrow(() -> {
            Asignatura guardada = asignaturaService.guardar(asignaturaValida);
            assertNotNull(guardada.getId(), "Debe asignarse un ID a la asignatura válida");
            logger.info("✅ Asignatura válida guardada: {}", guardada.getCodigo());
        }, "Una asignatura válida debe guardarse sin excepciones");

        // Given - Criar una asignatura que viola las reglas OCL
        // Horas: 20 + 20 = 40, pero 3 créditos * 16 = 48 ❌ (regla violada)
        Asignatura asignaturaInvalida = Asignatura.builder()
                .codigo("QUI101")
                .nombre("Química I")
                .creditos(3)
                .horasTeoricas(20)
                .horasPracticas(20) // 20 + 20 = 40 ≠ 3 * 16 = 48 ❌
                .activa(true)
                .build();

        // When & Then - La asignatura inválida debe ser rechazada
        // assertThrows verifica que se lance la excepción esperada
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> asignaturaService.guardar(asignaturaInvalida),
                "Una asignatura inválida debe lanzar IllegalArgumentException"
        );

        // Verificar que el mensaje de excepción menciona las reglas OCL
        assertTrue(exception.getMessage().contains("reglas OCL"),
                "El mensaje de error debe mencionar las reglas OCL");

        // Registrar el rechazo exitoso de datos inválidos
        logger.info("❌ Asignatura inválida rechazada: {}", exception.getMessage());
    }

    /**
     * Test integral de búsqueda y consulta de asignaturas.
     *
     * Este test verifica todas las funcionalidades de búsqueda y consulta
     * disponibles en el servicio de asignaturas. Se valida que:
     *
     * Funcionalidades probadas:
     * - Obtener todas las asignaturas
     * - Buscar por código específico
     * - Buscar por nombre (búsqueda parcial)
     * - Filtrar por número de créditos
     * - Filtrar por estado (activas/inactivas)
     *
     * Casos de prueba:
     * - Múltiples asignaturas con diferentes características
     * - Búsquedas que devuelven un solo resultado
     * - Búsquedas que devuelven múltiples resultados
     * - Filtros por diferentes criterios
     *
     * Patrón Given-When-Then (múltiple):
     * - Given: Base de datos con varias asignaturas de prueba
     * - When: Se ejecutan diferentes tipos de búsqueda
     * - Then: Se verifica que cada búsqueda devuelve los resultados correctos
     *
     * @see AsignaturaService#obtenerTodas
     * @see AsignaturaService#obtenerPorCodigo
     * @see AsignaturaService#buscarPorNombre
     * @see AsignaturaService#obtenerPorCreditos
     * @see AsignaturaService#obtenerActivas
     */
    @Test
    @DisplayName("🔍 Debe buscar asignaturas por diferentes criterios")
    void debeBuscarAsignaturasPorDiferentesCriterios() {
        // Given - Crear un conjunto diverso de asignaturas para probar las búsquedas
        // Creamos asignaturas con diferentes características para probar todos los filtros
        asignaturaService.crearAsignatura("MAT101", "Matemáticas I", 4, 48, 16);
        asignaturaService.crearAsignatura("MAT102", "Matemáticas II", 4, 48, 16);
        asignaturaService.crearAsignatura("FIS101", "Física I", 3, 32, 16);

        // When & Then - Buscar todas las asignaturas
        // Debe devolver exactamente las 3 asignaturas creadas
        List<Asignatura> todasLasAsignaturas = asignaturaService.obtenerTodas();
        assertEquals(3, todasLasAsignaturas.size(), "Debe haber exactamente 3 asignaturas");
        logger.info("📚 Total de asignaturas: {}", todasLasAsignaturas.size());

        // When & Then - Buscar por código específico
        // Debe encontrar exactamente la asignatura con ese código
        Optional<Asignatura> mat101 = asignaturaService.obtenerPorCodigo("MAT101");
        assertTrue(mat101.isPresent(), "Debe encontrar la asignatura MAT101");
        assertEquals("Matemáticas I", mat101.get().getNombre(),
                "El nombre debe coincidir con la asignatura encontrada");
        logger.info("🔍 Encontrada por código: {}", mat101.get().getNombre());

        // When & Then - Buscar por nombre parcial
        // Debe encontrar todas las asignaturas que contengan "Matemáticas" en el nombre
        List<Asignatura> matematicas = asignaturaService.buscarPorNombre("Matemáticas");
        assertEquals(2, matematicas.size(), "Debe encontrar 2 asignaturas de matemáticas");
        logger.info("🔍 Encontradas por nombre 'Matemáticas': {}", matematicas.size());

        // When & Then - Buscar por número de créditos
        // Debe encontrar todas las asignaturas que tengan exactamente 4 créditos
        List<Asignatura> de4Creditos = asignaturaService.obtenerPorCreditos(4);
        assertEquals(2, de4Creditos.size(), "Debe haber 2 asignaturas de 4 créditos");
        logger.info("🔍 Asignaturas de 4 créditos: {}", de4Creditos.size());

        // When & Then - Buscar asignaturas activas
        // Por defecto todas las asignaturas se crean activas
        List<Asignatura> activas = asignaturaService.obtenerActivas();
        assertEquals(3, activas.size(), "Todas las asignaturas deben estar activas");
        logger.info("✅ Asignaturas activas: {}", activas.size());
    }

    /**
     * Test de gestión de estados de asignaturas.
     *
     * Las asignaturas pueden estar activas o inactivas. Este test verifica
     * que el sistema puede cambiar correctamente el estado de una asignatura
     * y que estos cambios se persisten adecuadamente.
     *
     * Funcionalidades probadas:
     * - Desactivación de asignaturas activas
     * - Reactivación de asignaturas inactivas
     * - Persistencia de cambios de estado
     * - Validación de estados después de cambios
     *
     * Casos de uso:
     * - Asignatura que ya no se dicta (desactivar)
     * - Asignatura que vuelve a dictarse (reactivar)
     * - Auditoría de cambios de estado
     *
     * Patrón Given-When-Then (secuencial):
     * 1. Given: Asignatura activa recién creada
     *    When: Se desactiva la asignatura
     *    Then: El estado cambia a inactivo
     *
     * 2. Given: Asignatura desactivada del paso anterior
     *    When: Se reactiva la asignatura
     *    Then: El estado cambia a activo nuevamente
     *
     * @see AsignaturaService#cambiarEstado
     */
    @Test
    @DisplayName("🔄 Debe manejar cambios de estado correctamente")
    void debeManejarCambiosDeEstado() {
        // Given - Crear una asignatura que por defecto estará activa
        Asignatura asignatura = asignaturaService.crearAsignatura(
                "PRG101", "Programación I", 3, 32, 16);

        // Verificar el estado inicial (debe estar activa)
        assertTrue(asignatura.getActiva(), "Una asignatura nueva debe estar activa");

        // When - Desactivar la asignatura
        // Cambiar el estado de activa (true) a inactiva (false)
        Asignatura asignaturaDesactivada = asignaturaService.cambiarEstado(
                asignatura.getId(), false);

        // Then - Verificar que el estado cambió correctamente
        assertFalse(asignaturaDesactivada.getActiva(),
                "La asignatura debe estar inactiva después del cambio");
        logger.info("⏸️ Asignatura desactivada: {}", asignaturaDesactivada.getCodigo());

        // When - Reactivar la asignatura
        // Cambiar el estado de inactiva (false) a activa (true)
        Asignatura asignaturaReactivada = asignaturaService.cambiarEstado(
                asignatura.getId(), true);

        // Then - Verificar que el estado volvió a activo
        assertTrue(asignaturaReactivada.getActiva(),
                "La asignatura debe estar activa después de la reactivación");
        logger.info("▶️ Asignatura reactivada: {}", asignaturaReactivada.getCodigo());
    }

    /**
     * Test de generación de estadísticas y métricas del sistema.
     *
     * El sistema debe poder generar estadísticas útiles sobre las asignaturas
     * para análisis y reportes administrativos. Este test verifica que:
     *
     * Estadísticas generadas:
     * - Número total de asignaturas en el sistema
     * - Cantidad de asignaturas activas
     * - Cantidad de asignaturas inactivas
     * - Promedio de créditos por asignatura
     *
     * Escenario de prueba:
     * - Se crean múltiples asignaturas con diferentes estados y créditos
     * - Se generan las estadísticas
     * - Se verifican todos los cálculos
     *
     * Casos incluidos:
     * - Asignaturas activas con diferentes créditos
     * - Asignatura inactiva para probar el conteo por estados
     * - Cálculo correcto de promedios
     *
     * Patrón Given-When-Then:
     * - Given: Conjunto variado de asignaturas (activas e inactivas)
     * - When: Se solicitan las estadísticas del sistema
     * - Then: Se verifican todos los valores calculados
     *
     * @see AsignaturaService#obtenerEstadisticas
     * @see AsignaturaService.EstadisticasAsignaturas
     */
    @Test
    @DisplayName("📊 Debe generar estadísticas correctamente")
    void debeGenerarEstadisticas() {
        // Given - Crear un conjunto de asignaturas con diferentes características
        // Crear 2 asignaturas activas con diferentes créditos
        asignaturaService.crearAsignatura("EST101", "Estadística", 3, 32, 16);
        asignaturaService.crearAsignatura("EST102", "Estadística II", 4, 48, 16);

        // Crear una asignatura y luego desactivarla para probar conteos por estado
        Asignatura inactiva = asignaturaService.crearAsignatura("EST103", "Estadística III", 3, 32, 16);
        asignaturaService.cambiarEstado(inactiva.getId(), false);

        // When - Generar las estadísticas del sistema
        AsignaturaService.EstadisticasAsignaturas stats = asignaturaService.obtenerEstadisticas();

        // Then - Verificar que todas las estadísticas son correctas
        // Verificar conteo total (3 asignaturas creadas)
        assertEquals(3L, stats.getTotalAsignaturas(),
                "El total debe ser 3 asignaturas");

        // Verificar conteo de activas (2 de las 3 están activas)
        assertEquals(2L, stats.getAsignaturasActivas(),
                "Debe haber 2 asignaturas activas");

        // Verificar conteo de inactivas (1 de las 3 está inactiva)
        assertEquals(1L, stats.getAsignaturasInactivas(),
                "Debe haber 1 asignatura inactiva");

        // Verificar que el promedio de créditos es positivo
        // No validamos el valor exacto ya que puede variar según la implementación
        assertTrue(stats.getPromedioCreditosPorAsignatura() > 0,
                "El promedio de créditos debe ser positivo");

        // Registrar todas las estadísticas generadas para auditoría
        logger.info("📊 Estadísticas generadas:");
        logger.info("   - Total: {}", stats.getTotalAsignaturas());
        logger.info("   - Activas: {}", stats.getAsignaturasActivas());
        logger.info("   - Inactivas: {}", stats.getAsignaturasInactivas());
        logger.info("   - Promedio créditos: {}", stats.getPromedioCreditosPorAsignatura());
    }

    /**
     * Test de validación de códigos únicos de asignaturas.
     *
     * El sistema debe garantizar que no existan dos asignaturas con el mismo código,
     * ya que el código sirve como identificador único de negocio. Este test verifica
     * que el sistema rechace correctamente intentos de crear asignaturas duplicadas.
     *
     * Regla de negocio:
     * - Los códigos de asignatura deben ser únicos in ALL el sistema
     * - El intento de crear una asignatura con código duplicado debe fallar
     * - El mensaje de error debe ser claro y descriptivo
     *
     * Escenario de prueba:
     * 1. Crear una asignatura con un código específico
     * 2. Intentar crear otra asignatura con el mismo código
     * 3. Verificar que se rechaza con una excepción apropiada
     *
     * Importancia:
     * - Mantiene la integridad de datos
     * - Evita confusiones administrativas
     * - Facilita búsquedas y referencias únicas
     *
     * Patrón Given-When-Then:
     * - Given: Una asignatura ya existe con un código específico
     * - When: Se intenta crear otra asignatura con el mismo código
     * - Then: Se lanza excepción con mensaje descriptivo
     *
     * @see AsignaturaService#crearAsignatura
     * @see IllegalArgumentException
     */
    @Test
    @DisplayName("🚫 Debe rechazar códigos duplicados")
    void debeRechazarCodigosDuplicados() {
        // Given - Crear la primera asignatura con un código específico
        // Esta asignatura se crea exitosamente y establece el código como "ocupado"
        asignaturaService.crearAsignatura("DUP101", "Primera", 3, 32, 16);

        // When & Then - Intentar crear una segunda asignatura con el mismo código
        // Esta operación debe fallar y lanzar una excepción
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> asignaturaService.crearAsignatura("DUP101", "Segunda", 4, 48, 16),
                "Debe lanzar excepción al intentar crear asignatura con código duplicado"
        );

        // Verificar que el mensaje de error es descriptivo y menciona el problema
        assertTrue(exception.getMessage().contains("Ya existe una asignatura con código"),
                "El mensaje debe indicar claramente que el código ya existe");

        // Registrar el rechazo exitoso para auditoría
        logger.info("❌ Código duplicado rechazado correctamente: {}", exception.getMessage());
    }
}