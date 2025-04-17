package com.alicantefutura.impulsedata.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173",
                    "http://localhost",
                    "http://localhost:80",
                    "https://impulsedata.vercel.app",
                    "https://impulsedata-git-main-reynalrodriguez.vercel.app",
                    "https://impulsedata-reynalrodriguez.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("Authorization", "Content-Type", "Access-Control-Allow-Origin")
                .exposedHeaders("Authorization", "Content-Type", "Access-Control-Allow-Origin")
                .allowCredentials(true)
                .maxAge(3600); // Tiempo de caché de preflight en segundos
    }
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permitir orígenes específicos
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost",
            "http://localhost:80",
            "https://impulsedata.vercel.app",
            "https://impulsedata-git-main-reynalrodriguez.vercel.app",
            "https://impulsedata-reynalrodriguez.vercel.app"
        ));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Access-Control-Allow-Origin"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "Access-Control-Allow-Origin"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
