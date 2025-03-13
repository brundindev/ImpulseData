package com.alicantefutura.impulsedata.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.alicantefutura.impulsedata.model.Usuario;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;

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
                QueryDocumentSnapshot usuarioDoc = firestore.collection("usuarios")
                        .whereEqualTo("email", username)
                        .get()
                        .get()
                        .getDocuments()
                        .get(0);

                Usuario usuario = usuarioDoc.toObject(Usuario.class);
                if (usuario == null) {
                    throw new UsernameNotFoundException("Usuario no encontrado");
                }
                return usuario;
            } catch (Exception e) {
                throw new UsernameNotFoundException("Error al buscar usuario: " + e.getMessage());
            }
        };
    }
} 