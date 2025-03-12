package com.alicantefutura.impulsedata.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alicantefutura.impulsedata.model.Usuario;
import com.google.cloud.firestore.Firestore;

@Service
public class FirestoreService {

    private final Firestore firestore;
    private final Logger logger = LoggerFactory.getLogger(FirestoreService.class);

    @Autowired
    public FirestoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * Busca un usuario por su email y devuelve su ID
     * 
     * @param email Email del usuario a buscar
     * @return UID del usuario o null si no se encuentra
     */
    public String buscarUsuarioPorEmail(String email) {
        try {
            var userDoc = firestore.collection("usuarios")
                    .whereEqualTo("email", email)
                    .get()
                    .get()
                    .getDocuments();

            if (userDoc.isEmpty()) {
                return null;
            }

            var usuario = userDoc.get(0).toObject(Usuario.class);
            return usuario.getId();
        } catch (Exception e) {
            logger.error("Error al buscar usuario por email: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Guarda un usuario en Firestore con el ID especificado
     * 
     * @param usuario Usuario a guardar
     * @param uid ID con el que guardar el usuario
     * @return true si se guardó correctamente, false si no
     */
    public boolean guardarUsuario(Usuario usuario, String uid) {
        try {
            logger.info("Intentando guardar usuario en Firestore. Email: {}, UID: {}", usuario.getEmail(), uid);
            
            // Asegurarnos que el ID está establecido correctamente
            usuario.setId(uid);
            
            // Guardar el usuario en Firestore
            firestore.collection("usuarios").document(uid).set(usuario).get();
            
            // Verificar que se haya guardado correctamente
            var doc = firestore.collection("usuarios").document(uid).get().get();
            if (doc.exists()) {
                logger.info("Usuario guardado correctamente en Firestore. UID: {}", uid);
                return true;
            } else {
                logger.error("Error: El documento no existe después de intentar guardarlo. UID: {}", uid);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error al guardar usuario en Firestore: {}", e.getMessage(), e);
            return false;
        }
    }
} 