package com.alicantefutura.impulsedata.controller;

import com.alicantefutura.impulsedata.service.FirebaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/firebase")
@Tag(name = "Firebase", description = "Operaciones relacionadas con Firebase")
public class FirebaseController {

    private final FirebaseService firebaseService;

    public FirebaseController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @Operation(
        summary = "Guardar datos en Firebase",
        description = "Guarda un conjunto de datos en la colección 'usuarios' con un ID específico."
    )
    @PostMapping("/guardar")
    public String guardarDatos() throws ExecutionException, InterruptedException {
        Map<String, Object> datos = new HashMap<>();
        datos.put("nombre", "Ejemplo");
        datos.put("edad", 25);
        return firebaseService.guardarDatos("usuarios", "usuario1", datos);
    }
}
