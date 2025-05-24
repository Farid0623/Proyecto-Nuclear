package cue.edu.co.moduloasignaturas;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.TestPropertySource;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@TestConfiguration
@TestPropertySource(properties = {
        "spring.data.mongodb.database=test_pensum_db",
        "spring.data.mongodb.host=localhost",
        "spring.data.mongodb.port=27017"
})
public class TestConfig {

    @Bean
    @Primary
    public MongoClient testMongoClient() {
        return MongoClients.create("mongodb://localhost:27017");
    }

    @Bean
    @Primary
    public MongoTemplate testMongoTemplate() {
        return new MongoTemplate(testMongoClient(), "test_pensum_db");
    }
}