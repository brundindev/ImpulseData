package com.alicantefutura.impulsedata.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.credentials.path}")
    private String firebaseCredentialsPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        // Si ya existe una instancia, la devolvemos
        if (FirebaseApp.getApps().size() > 0) {
            return FirebaseApp.getInstance();
        }

        // Crear el JSON desde variables de entorno
        Map<String, Object> credentials = new HashMap<>();
        credentials.put("type", System.getenv("FIREBASE_TYPE"));
        credentials.put("project_id", System.getenv("FIREBASE_PROJECT_ID"));
        credentials.put("private_key_id", System.getenv("FIREBASE_PRIVATE_KEY_ID"));
        // Asegúrate de reemplazar los escapes \n en la clave privada
        credentials.put("private_key", System.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"));
        credentials.put("client_email", System.getenv("FIREBASE_CLIENT_EMAIL"));
        credentials.put("client_id", System.getenv("FIREBASE_CLIENT_ID"));
        credentials.put("auth_uri", System.getenv("FIREBASE_AUTH_URI"));
        credentials.put("token_uri", System.getenv("FIREBASE_TOKEN_URI"));
        credentials.put("auth_provider_x509_cert_url", System.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"));
        credentials.put("client_x509_cert_url", System.getenv("FIREBASE_CLIENT_X509_CERT_URL"));
        
        // Convertir el mapa a JSON
        String jsonCredentials = new com.google.gson.Gson().toJson(credentials);
        
        // Crear las opciones de Firebase con el JSON
        InputStream credentialsStream = new ByteArrayInputStream(jsonCredentials.getBytes());
        GoogleCredentials googleCredentials = GoogleCredentials.fromStream(credentialsStream);
        
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(googleCredentials)
                .setDatabaseUrl("https://impulsedata-alicantefutura-default-rtdb.europe-west1.firebasedatabase.app")
                .build();
        
        // Inicializar Firebase
        return FirebaseApp.initializeApp(options);
    }

    @Bean
    @DependsOn("firebaseApp")
    public Firestore firestore() throws IOException {
        return FirestoreClient.getFirestore();
    }
}