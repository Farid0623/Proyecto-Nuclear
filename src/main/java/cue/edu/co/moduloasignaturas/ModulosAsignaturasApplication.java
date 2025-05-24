package cue.edu.co.moduloasignaturas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class ModulosAsignaturasApplication {
    public static void main(String[] args) {
        SpringApplication.run(ModulosAsignaturasApplication.class, args);
    }
}