package cue.edu.co.moduloasignaturas.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Test simple para verificar que IntelliJ está configurado correctamente
 */
@DisplayName("Asignatura Service - Test Básico")
class AsignaturaServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(AsignaturaServiceTest.class);

    @Test
    @DisplayName("✅ Test básico - debe pasar siempre")
    void testBasico() {
        // Given
        String mensaje = "Hola Mundo";

        // When
        int longitud = mensaje.length();

        // Then
        assertEquals(10, longitud);
        assertTrue(mensaje.contains("Mundo"));
        assertNotNull(mensaje);

        logger.info("🎉 ¡Test ejecutado correctamente!");
    }

    @Test
    @DisplayName("✅ Test de matemáticas básicas")
    void testMatematicas() {
        // Given
        int a = 5;
        int b = 3;

        // When
        int suma = a + b;
        int multiplicacion = a * b;

        // Then
        assertEquals(8, suma);
        assertEquals(15, multiplicacion);
        assertTrue(suma > 0);

        logger.info("📊 Suma: {}, Multiplicación: {}", suma, multiplicacion);
    }

    @Test
    @DisplayName("❌ Test que debe fallar intencionalmente")
    void testQueFalla() {
        // Este test está comentado para que no falle
        // Descomenta la siguiente línea para ver un test fallido:
        // fail("Este test falla intencionalmente para mostrar cómo se ve")

        // En su lugar, ponemos un test que pasa:
        //Se desaparece en el sonarQube el fallo
        assertTrue(true);
        logger.info("🟡 Test configurado para pasar (descomenta para ver fallo)");
    }
}