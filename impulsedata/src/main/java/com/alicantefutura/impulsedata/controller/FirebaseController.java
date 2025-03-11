package com.alicantefutura.impulsedata.controller;

import com.alicantefutura.impulsedata.service.FirebaseService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/firebase")
public class FirebaseController {

    private final FirebaseService firebaseService;

    public FirebaseController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @PostMapping("/guardar")
    public String guardarDatos() throws ExecutionException, InterruptedException {
        Map<String, Object> datos = new HashMap<>();
        datos.put("nombre", "Ejemplo");
        datos.put("edad", 25);
        return firebaseService.guardarDatos("usuarios", "usuario1", datos);
    }
}