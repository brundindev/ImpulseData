package com.alicantefutura.impulsedata.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name:drqt6gd5v}")
    private String cloudName;

    @Value("${cloudinary.api-key:526484494966574}")
    private String apiKey;

    @Value("${cloudinary.api-secret:t04f4oTOoaQtm2U286AopfRta0k}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", "true");
        
        return new Cloudinary(config);
    }
} 