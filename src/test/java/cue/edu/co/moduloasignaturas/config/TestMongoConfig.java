package cue.edu.co.moduloasignaturas.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

/**
 * Configuración de MongoDB para tests
 * Usa una base de datos separada para no afectar los datos reales
 */
@TestConfiguration
@Profile("test")
@EnableMongoRepositories(basePackages = "cue.edu.co.modulosasignaturas.repository")
public class TestMongoConfig {

    private static final String TEST_DB_NAME = "test_pensum_db";
    private static final String MONGO_HOST = "localhost";
    private static final int MONGO_PORT = 27017;

    @Bean
    @Primary
    public MongoClient testMongoClient() {
        String connectionString = String.format("mongodb://%s:%d/%s",
                MONGO_HOST, MONGO_PORT, TEST_DB_NAME);
        return MongoClients.create(connectionString);
    }

    @Bean
    @Primary
    public MongoTemplate testMongoTemplate() {
        return new MongoTemplate(testMongoClient(), TEST_DB_NAME);
    }
}