package cue.edu.co.moduloasignaturas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.event.ValidatingMongoEventListener;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.beans.factory.annotation.Value;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;

/**
 * Configuración de MongoDB para el módulo de asignaturas
 * Configurado para Mac con MongoDB local
 */
@Configuration
@EnableMongoRepositories(basePackages = "cue.edu.co.modulosasignaturas.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.database:pensum_db}")
    private String databaseName;

    @Value("${spring.data.mongodb.host:localhost}")
    private String mongoHost;

    @Value("${spring.data.mongodb.port:27017}")
    private int mongoPort;

    @Override
    protected String getDatabaseName() {
        return databaseName;
    }

    @Override
    public MongoClient mongoClient() {
        // Connection string para MongoDB local en Mac
        String connectionString = String.format("mongodb://%s:%d/%s",
                mongoHost, mongoPort, databaseName);

        MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .build();

        return MongoClients.create(mongoClientSettings);
    }

    /**
     * Template personalizado para operaciones avanzadas
     */
    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }

    /**
     * Validador de entidades antes de guardar en MongoDB
     */
    @Bean
    public ValidatingMongoEventListener validatingMongoEventListener() {
        return new ValidatingMongoEventListener(validator());
    }

    /**
     * Validador Bean Validation
     */
    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }

    /**
     * Configuración adicional para desarrollo
     */
    @Override
    protected boolean autoIndexCreation() {
        return true; // Crear índices automáticamente
    }
}