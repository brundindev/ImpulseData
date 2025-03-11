package com.alicantefutura.impulsedata.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alicantefutura.impulsedata.dto.LoginRequest;
import com.alicantefutura.impulsedata.dto.RegistroRequest;
import com.alicantefutura.impulsedata.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registro(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.ok(authService.registro(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @GetMapping("/verificar-email")
    public ResponseEntity<String> verificarEmail(@RequestParam("uid") String uid) {
        boolean verificado = authService.verificarEmail(uid);
        if (verificado) {
            return ResponseEntity.ok("Email verificado con éxito. Ahora puedes iniciar sesión.");
        } else {
            return ResponseEntity.badRequest().body("No se pudo verificar el email. Intenta de nuevo más tarde.");
        }
    }
    
    @PostMapping("/reenviar-verificacion")
    public ResponseEntity<String> reenviarVerificacion(@RequestParam("email") String email) {
        try {
            String mensaje = authService.reenviarVerificacion(email);
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            // Log del error para diagnosticar problemas en el servidor
            System.err.println("Error al reenviar verificación: " + e.getMessage());
            if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER") || 
                e.getMessage().contains("demasiados intentos")) {
                return ResponseEntity.status(429) // Too many requests
                        .body("Se han realizado demasiados intentos de envío. " +
                              "Por favor, espera unos minutos (15-30) antes de intentarlo nuevamente.");
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para enviar manualmente un correo de verificación a un usuario registrado
     * @param email El correo electrónico del usuario
     * @return Mensaje de confirmación
     */
    @GetMapping("/enviar-verificacion")
    public ResponseEntity<String> enviarVerificacion(@RequestParam("email") String email) {
        try {
            String mensaje = authService.enviarVerificacion(email);
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            // Log del error para diagnosticar problemas en el servidor
            System.err.println("Error al enviar verificación: " + e.getMessage());
            if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER") || 
                e.getMessage().contains("demasiados intentos")) {
                return ResponseEntity.status(429) // Too many requests
                        .body("Se han realizado demasiados intentos de envío. " +
                              "Por favor, espera unos minutos (15-30) antes de intentarlo nuevamente.");
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para forzar la verificación del email (solo para pruebas)
     * 
     * @param email Email del usuario
     * @return Mensaje de confirmación
     */
    @GetMapping("/forzar-verificacion")
    public ResponseEntity<String> forzarVerificacion(@RequestParam("email") String email) {
        try {
            authService.forzarVerificacionEmail(email);
            return ResponseEntity.ok("Email marcado como verificado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 