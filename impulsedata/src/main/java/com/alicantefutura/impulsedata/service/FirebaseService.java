package com.alicantefutura.impulsedata.service;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;

@Service
public class FirebaseService {

    private final Firestore db;

    public FirebaseService(Firestore db) {
        this.db = db;
    }

    public String guardarDatos(String coleccion, String id, Map<String, Object> datos) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(coleccion).document(id);
        WriteResult writeResult = docRef.set(datos).get();
        return "Datos guardados con éxito: " + writeResult.getUpdateTime();
    }
}