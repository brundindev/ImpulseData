package com.alicantefutura.impulsedata.service;

import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.UpdateRequest;

@Service
public class UsuarioService {
    
    private final Logger logger = LoggerFactory.getLogger(UsuarioService.class);
    
    @Autowired
    private Firestore firestore;
    
    @Autowired
    private FirebaseAuthService firebaseAuthService;
    
    /**
     * Actualiza el nombre de usuario tanto en Firebase Auth como en Firestore
     * 
     * @param email Email del usuario
     * @param nombreUsuario Nuevo nombre de usuario
     * @return true si la actualización fue exitosa, false en caso contrario
     */
    public boolean actualizarNombreUsuario(String email, String nombreUsuario) {
        try {
            logger.info("Actualizando nombre de usuario para: {}", email);
            
            // 1. Obtener el UID del usuario a partir del email
            UserRecord userRecord = firebaseAuthService.getUserByEmail(email);
            String uid = userRecord.getUid();
            
            // 2. Actualizar nombre en Firebase Auth
            UpdateRequest updateRequest = new UpdateRequest(uid)
                    .setDisplayName(nombreUsuario);
            
            FirebaseAuth.getInstance().updateUser(updateRequest);
            logger.info("Nombre de usuario actualizado en Firebase Auth para: {}", email);
            
            // 3. Actualizar nombre en Firestore
            firestore.collection("usuarios").document(uid)
                    .update("nombreUsuario", nombreUsuario)
                    .get();
            
            logger.info("Nombre de usuario actualizado en Firestore para: {}", email);
            
            return true;
        } catch (FirebaseAuthException e) {
            logger.error("Error al actualizar nombre en Firebase Auth: {}", e.getMessage());
            return false;
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error al actualizar nombre en Firestore: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            logger.error("Error general al actualizar nombre de usuario: {}", e.getMessage());
            return false;
        }
    }
} 