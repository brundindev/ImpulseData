package com.alicantefutura.impulsedata.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",
                "http://localhost",
                "http://localhost:80",
                "https://impulsedata.vercel.app",
                "https://impulsedata-git-main-reynalrodriguez.vercel.app",
                "https://impulsedata-reynalrodriguez.vercel.app"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Authorization", "Content-Type", "Access-Control-Allow-Origin")
            .exposedHeaders("Authorization", "Content-Type", "Access-Control-Allow-Origin")
            .allowCredentials(true)
            .maxAge(3600);
    }
} 