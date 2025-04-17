package com.alicantefutura.impulsedata.config;

import java.util.concurrent.ExecutionException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.alicantefutura.impulsedata.model.Usuario;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;

@Configuration
public class UserDetailsServiceConfig {

    private final Firestore firestore;

    public UserDetailsServiceConfig(Firestore firestore) {
        this.firestore = firestore;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            try {
                // Intentar primero buscar por email
                QuerySnapshot querySnapshot = firestore.collection("usuarios")
                        .whereEqualTo("email", username)
                        .get()
                        .get();
                
                // Si no se encuentra por email, intentar por nombreUsuario
                if (querySnapshot.isEmpty()) {
                    querySnapshot = firestore.collection("usuarios")
                            .whereEqualTo("nombreUsuario", username)
                        .get()
                            .get();
                }
                
                // Si sigue sin encontrarse, lanzamos excepción
                if (querySnapshot.isEmpty()) {
                    throw new UsernameNotFoundException("Usuario no encontrado con identificador: " + username);
                }

                QueryDocumentSnapshot usuarioDoc = querySnapshot.getDocuments().get(0);
                Usuario usuario = usuarioDoc.toObject(Usuario.class);
                
                if (usuario == null) {
                    throw new UsernameNotFoundException("Usuario no encontrado");
                }
                
                return usuario;
            } catch (ExecutionException | InterruptedException e) {
                throw new UsernameNotFoundException("Error al buscar usuario: " + e.getMessage());
            }
        };
    }
} 