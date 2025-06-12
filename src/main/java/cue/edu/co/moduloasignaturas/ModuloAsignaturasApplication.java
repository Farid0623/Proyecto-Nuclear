package cue.edu.co.moduloasignaturas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class ModuloAsignaturasApplication {
    public static void main(String[] args) {
        SpringApplication.run(ModuloAsignaturasApplication.class, args);
    }
}