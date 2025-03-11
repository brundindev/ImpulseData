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
} 