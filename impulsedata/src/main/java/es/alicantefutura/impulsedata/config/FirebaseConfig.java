package es.alicantefutura.impulsedata.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.database.url}")
    private String databaseUrl;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        FirebaseOptions options;
        
        // Primero intentar cargar desde la variable de entorno FIREBASE_CONFIG
        String firebaseConfigJson = System.getenv("FIREBASE_CONFIG");
        if (firebaseConfigJson != null && !firebaseConfigJson.isEmpty()) {
            options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .setDatabaseUrl(databaseUrl)
                    .build();
        } else {
            // Intentar cargar desde la variable GOOGLE_APPLICATION_CREDENTIALS
            try {
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .setDatabaseUrl(databaseUrl)
                        .build();
            } catch (IOException e) {
                // Fallback al archivo local
                InputStream serviceAccount = 
                    new ClassPathResource("impulsedata-alicantefutura-firebase-adminsdk-fbsvc-01841a49ee.json").getInputStream();
                
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .setDatabaseUrl(databaseUrl)
                        .build();
            }
        }

        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }
} 