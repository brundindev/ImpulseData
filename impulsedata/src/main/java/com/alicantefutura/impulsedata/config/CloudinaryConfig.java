package com.alicantefutura.impulsedata.config;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "drqt6gd5v",
            "api_key", "526484494966574",
            "api_secret", "t04f4oTOoaQtm2U286AopfRta0k"
        ));
    }
}
