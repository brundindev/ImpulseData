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
import org.springframework.util.ResourceUtils;

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
            
            // Intentar varios métodos para cargar las credenciales
            try {
                // Intento 1: Cargar desde ClassPathResource
                Resource resource = new ClassPathResource(firebaseCredentialsPath.replace("classpath:", ""));
                InputStream serviceAccount = resource.getInputStream();
                credentials = GoogleCredentials.fromStream(serviceAccount);
                System.out.println("Credenciales de Firebase cargadas usando ClassPathResource");
            } catch (Exception e1) {
                try {
                    // Intento 2: Cargar usando ResourceUtils
                    File credentialFile = ResourceUtils.getFile(firebaseCredentialsPath);
                    InputStream serviceAccount = new FileInputStream(credentialFile);
                    credentials = GoogleCredentials.fromStream(serviceAccount);
                    System.out.println("Credenciales de Firebase cargadas usando ResourceUtils");
                } catch (Exception e2) {
                    try {
                        // Intento 3: Cargar usando ruta absoluta
                        String path = "src/main/resources/" + firebaseCredentialsPath.replace("classpath:", "");
                        InputStream serviceAccount = new FileInputStream(new File(path));
                        credentials = GoogleCredentials.fromStream(serviceAccount);
                        System.out.println("Credenciales de Firebase cargadas usando ruta absoluta");
                    } catch (Exception e3) {
                        // Intento 4: Como último recurso, usar credenciales por defecto
                        System.out.println("No se pudo cargar el archivo de credenciales. Usando credenciales por defecto.");
                        credentials = GoogleCredentials.getApplicationDefault();
                        System.out.println("Usando credenciales de aplicación por defecto");
                    }
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