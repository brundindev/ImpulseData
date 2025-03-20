package com.alicantefutura.impulsedata.config;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

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
        if (FirebaseApp.getApps().isEmpty()) {
            // Método alternativo para cargar las credenciales
            GoogleCredentials credentials;
            
            try {
                // Intento 1: Cargar desde la ruta directa proporcionada en application.properties (ideal para Docker)
                File credentialFile = new File(firebaseCredentialsPath);
                if (credentialFile.exists()) {
                    System.out.println("Archivo de credenciales encontrado en: " + firebaseCredentialsPath);
                    try (InputStream serviceAccount = new FileInputStream(credentialFile)) {
                        credentials = GoogleCredentials.fromStream(serviceAccount);
                        System.out.println("Credenciales de Firebase cargadas usando la ruta directa del archivo");
                    }
                } else {
                    System.out.println("El archivo de credenciales no existe en: " + firebaseCredentialsPath);
                    throw new IOException("El archivo de credenciales no existe en: " + firebaseCredentialsPath);
                }
            } catch (Exception e1) {
                System.out.println("Error al cargar las credenciales desde la ruta directa: " + e1.getMessage());
                try {
                    // Intento 2: Cargar desde ClassPathResource
                    Resource resource = new ClassPathResource(firebaseCredentialsPath.replace("classpath:", ""));
                    if (resource.exists()) {
                        try (InputStream serviceAccount = resource.getInputStream()) {
                            credentials = GoogleCredentials.fromStream(serviceAccount);
                            System.out.println("Credenciales de Firebase cargadas usando ClassPathResource");
                        }
                    } else {
                        throw new IOException("El archivo de credenciales no existe en el classpath");
                    }
                } catch (Exception e2) {
                    System.out.println("Error al cargar las credenciales desde el classpath: " + e2.getMessage());
                    // Intento 3: Como último recurso, usar credenciales por defecto
                    System.out.println("No se pudo cargar el archivo de credenciales. Usando credenciales por defecto.");
                    credentials = GoogleCredentials.getApplicationDefault();
                    System.out.println("Usando credenciales de aplicación por defecto");
                }
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();

            return FirebaseApp.initializeApp(options);
        } else {
            return FirebaseApp.getInstance();
        }
    }

    @Bean
    @DependsOn("firebaseApp")
    public Firestore firestore() throws IOException {
        return FirestoreClient.getFirestore();
    }
}