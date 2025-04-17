package com.alicantefutura.impulsedata.config;

import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceConfig.class);
    private final Firestore firestore;

    public UserDetailsServiceConfig(Firestore firestore) {
        this.firestore = firestore;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            try {
                logger.info("Buscando usuario por identificador: {}", username);
                
                // Determinar si el identificador es email o nombre de usuario
                boolean isEmail = username.contains("@");
                String tipoIdentificador = isEmail ? "email" : "nombreUsuario";
                
                logger.info("Tipo de identificador detectado: {}", tipoIdentificador);
                
                // Intentar buscar usuario con el tipo de identificador adecuado
                QuerySnapshot querySnapshot = firestore.collection("usuarios")
                        .whereEqualTo(tipoIdentificador, username)
                        .get()
                        .get();
                
                // Si no se encuentra con el identificador principal, intentar con el otro
                if (querySnapshot.isEmpty()) {
                    logger.warn("Usuario no encontrado con {} = {}. Intentando búsqueda alternativa.", tipoIdentificador, username);
                    
                    String campoAlternativo = isEmail ? "nombreUsuario" : "email";
                    querySnapshot = firestore.collection("usuarios")
                            .whereEqualTo(campoAlternativo, username)
                            .get()
                            .get();
                            
                    if (!querySnapshot.isEmpty()) {
                        logger.info("Usuario encontrado con campo alternativo {} = {}", campoAlternativo, username);
                    }
                } else {
                    logger.info("Usuario encontrado con {} = {}", tipoIdentificador, username);
                }
                
                // Si sigue sin encontrarse, lanzamos excepción
                if (querySnapshot.isEmpty()) {
                    logger.error("Usuario no encontrado con ningún método de búsqueda para: {}", username);
                    throw new UsernameNotFoundException("Usuario no encontrado con identificador: " + username);
                }

                QueryDocumentSnapshot usuarioDoc = querySnapshot.getDocuments().get(0);
                Usuario usuario = usuarioDoc.toObject(Usuario.class);
                
                if (usuario == null) {
                    logger.error("Error al convertir documento a objeto Usuario para: {}", username);
                    throw new UsernameNotFoundException("Usuario no encontrado o datos incorrectos");
                }
                
                // Establecer el ID del documento como ID del usuario
                String uid = usuarioDoc.getId();
                usuario.setId(uid);
                
                logger.info("Usuario cargado correctamente: {}, ID: {}, Roles: {}", 
                    usuario.getUsername(), uid, usuario.getAuthorities());
                
                return usuario;
            } catch (ExecutionException | InterruptedException e) {
                logger.error("Error al buscar usuario {}: {}", username, e.getMessage(), e);
                throw new UsernameNotFoundException("Error al buscar usuario: " + e.getMessage());
            }
        };
    }
} 