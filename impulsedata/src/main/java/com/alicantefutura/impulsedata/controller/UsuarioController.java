package com.alicantefutura.impulsedata.controller;

import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alicantefutura.impulsedata.model.Usuario;
import com.alicantefutura.impulsedata.service.FirebaseAuthService;
import com.alicantefutura.impulsedata.service.UsuarioService;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Endpoints relacionados con la gestión de usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private Firestore firestore;

    @Operation(summary = "Obtener perfil de usuario", description = "Obtiene el perfil del usuario autenticado")
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }
        
        try {
            Usuario usuario = (Usuario) auth.getPrincipal();
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener el perfil: " + e.getMessage());
        }
    }
    
    @Operation(summary = "Actualizar nombre de usuario", description = "Actualiza el nombre de usuario en Firestore y Firebase Auth")
    @PostMapping("/actualizar-nombre")
    public ResponseEntity<?> actualizarNombreUsuario(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String nombreUsuario = request.get("nombreUsuario");
            
            if (email == null || nombreUsuario == null) {
                return ResponseEntity.badRequest().body("Email y nombre de usuario son requeridos");
            }
            
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(401).body("Usuario no autenticado");
            }
            
            Usuario usuarioActual = (Usuario) auth.getPrincipal();
            
            // Verificar que el usuario autenticado está actualizando su propio perfil
            if (!usuarioActual.getEmail().equals(email)) {
                return ResponseEntity.status(403).body("No tienes permiso para actualizar este perfil");
            }
            
            // Actualizar el nombre de usuario
            boolean actualizado = usuarioService.actualizarNombreUsuario(email, nombreUsuario);
            
            if (actualizado) {
                return ResponseEntity.ok("Nombre de usuario actualizado correctamente");
            } else {
                return ResponseEntity.badRequest().body("No se pudo actualizar el nombre de usuario");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el nombre de usuario: " + e.getMessage());
        }
    }

    @GetMapping("/nombre")
    public ResponseEntity<Map<String, String>> obtenerNombreUsuario(Authentication authentication) {
        try {
            String email = authentication.getName();
            QuerySnapshot querySnapshot = firestore.collection("usuarios")
                    .whereEqualTo("email", email)
                    .get()
                    .get();
            
            if (querySnapshot.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            var usuarioDoc = querySnapshot.getDocuments().get(0);
            Usuario usuario = usuarioDoc.toObject(Usuario.class);
            
            if (usuario == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("nombreUsuario", usuario.getNombreUsuario());
            
            return ResponseEntity.ok(response);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 