package com.alicantefutura.impulsedata.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alicantefutura.impulsedata.dto.LoginRequest;
import com.alicantefutura.impulsedata.dto.RegistroRequest;
import com.alicantefutura.impulsedata.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints relacionados con la autenticación de usuarios")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Registro de usuario", description = "Registra un nuevo usuario en el sistema.")
    @PostMapping("/registro")
    public ResponseEntity<String> registro(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.ok(authService.registro(request));
    }

    @Operation(summary = "Inicio de sesión", description = "Autentica un usuario y devuelve un token JWT.")
    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Verificar email", description = "Verifica la dirección de correo electrónico de un usuario mediante su UID.")
    @GetMapping("/verificar-email")
    public ResponseEntity<String> verificarEmail(@RequestParam("uid") String uid) {
        boolean verificado = authService.verificarEmail(uid);
        if (verificado) {
            return ResponseEntity.ok("Email verificado con éxito. Ahora puedes iniciar sesión.");
        } else {
            return ResponseEntity.badRequest().body("No se pudo verificar el email. Intenta de nuevo más tarde.");
        }
    }

    @Operation(summary = "Reenviar correo de verificación", description = "Reenvía el correo de verificación a un usuario.")
    @PostMapping("/reenviar-verificacion")
    public ResponseEntity<String> reenviarVerificacion(@RequestParam("email") String email) {
        try {
            String mensaje = authService.reenviarVerificacion(email);
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            System.err.println("Error al reenviar verificación: " + e.getMessage());
            if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER") || e.getMessage().contains("demasiados intentos")) {
                return ResponseEntity.status(429)
                        .body("Se han realizado demasiados intentos de envío. " +
                                "Por favor, espera unos minutos (15-30) antes de intentarlo nuevamente.");
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Enviar verificación manual", description = "Envía manualmente un correo de verificación a un usuario registrado.")
    @GetMapping("/enviar-verificacion")
    public ResponseEntity<String> enviarVerificacion(@RequestParam("email") String email) {
        try {
            String mensaje = authService.enviarVerificacion(email);
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            System.err.println("Error al enviar verificación: " + e.getMessage());
            if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER") || e.getMessage().contains("demasiados intentos")) {
                return ResponseEntity.status(429)
                        .body("Se han realizado demasiados intentos de envío. " +
                                "Por favor, espera unos minutos (15-30) antes de intentarlo nuevamente.");
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Forzar verificación de email", description = "Marca manualmente un email como verificado (para pruebas).")
    @GetMapping("/forzar-verificacion")
    public ResponseEntity<String> forzarVerificacion(@RequestParam("email") String email) {
        try {
            authService.forzarVerificacionEmail(email);
            return ResponseEntity.ok("Email marcado como verificado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Actualizar contraseña", description = "Actualiza la contraseña de un usuario autenticado.")
    @PostMapping("/actualizar-password")
    public ResponseEntity<String> actualizarPassword(
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        try {
            String email = request.get("email");
            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");
            
            if (email == null || oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Todos los campos son requeridos: email, oldPassword, newPassword");
            }
            
            // Extraer el token sin el prefijo "Bearer "
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            } else {
                return ResponseEntity.status(401).body("Token de autorización inválido");
            }
            
            boolean actualizado = authService.actualizarPassword(email, oldPassword, newPassword, token);
            
            if (actualizado) {
                return ResponseEntity.ok("Contraseña actualizada con éxito");
            } else {
                return ResponseEntity.badRequest().body("No se pudo actualizar la contraseña");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar la contraseña: " + e.getMessage());
        }
    }
}
