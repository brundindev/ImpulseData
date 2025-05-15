package com.alicantefutura.impulsedata.service;

import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.alicantefutura.impulsedata.dto.CookiePreferenceDTO;
import com.alicantefutura.impulsedata.model.CookiePreference;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

@Service
public class CookiePreferenceService {

    private static final String COLLECTION_NAME = "cookie_preferences";

    public CookiePreference savePreferences(CookiePreferenceDTO cookiePreferenceDTO) {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            String userId = cookiePreferenceDTO.getUserId();
            
            // Crear el objeto de preferencias
            CookiePreference cookiePreference = new CookiePreference(
                userId,
                cookiePreferenceDTO.getPreferences().isNecessary(),
                cookiePreferenceDTO.getPreferences().isAnalytics(),
                cookiePreferenceDTO.getPreferences().isMarketing()
            );
            
            // Verificar si ya existe un documento para este usuario
            DocumentReference docRef = dbFirestore.collection(COLLECTION_NAME).document(userId);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            
            if (document.exists()) {
                // Actualizar documento existente
                cookiePreference.updateTimestamp();
                ApiFuture<WriteResult> writeResult = docRef.set(cookiePreference);
                System.out.println("Update time : " + writeResult.get().getUpdateTime());
            } else {
                // Crear nuevo documento
                ApiFuture<WriteResult> writeResult = docRef.set(cookiePreference);
                System.out.println("Creation time : " + writeResult.get().getUpdateTime());
            }
            
            return cookiePreference;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error al guardar preferencias de cookies: " + e.getMessage(), e);
        }
    }

    public Optional<CookiePreference> getPreferencesByUserId(String userId) {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            DocumentReference docRef = dbFirestore.collection(COLLECTION_NAME).document(userId);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            
            if (document.exists()) {
                return Optional.ofNullable(document.toObject(CookiePreference.class));
            }
            
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error al obtener preferencias de cookies: " + e.getMessage());
            return Optional.empty();
        }
    }
} 