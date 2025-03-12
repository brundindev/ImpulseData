package com.alicantefutura.impulsedata.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        // Definir el esquema de seguridad (Bearer Token)
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .name("Authorization")
                .in(SecurityScheme.In.HEADER);

        // Definir los requisitos de seguridad globales (todos los endpoints requieren autenticación)
        SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        return new OpenAPI()
                .info(new Info()
                        .title("Impulsedata API")
                        .version("1.0")
                        .description("Documentación de la API de Impulsedata"))
                .addSecurityItem(securityRequirement) // Requerir autenticación para interactuar con la API
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth", securityScheme)); // Incluir el esquema de seguridad en Swagger
    }
}
