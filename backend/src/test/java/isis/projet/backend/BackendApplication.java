package isis.projet.backend;

import org.h2.tools.Server;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.sql.SQLException;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean // Permet d'injecter un ModelMapper dans les classes qui en ont besoin (@autowired)
	ModelMapper modelMapper() {
		return new ModelMapper();
	}

}
