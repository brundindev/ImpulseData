package com.alicantefutura.impulsedata.service;

import java.util.concurrent.ExecutionException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alicantefutura.impulsedata.dto.LoginRequest;
import com.alicantefutura.impulsedata.dto.RegistroRequest;
import com.alicantefutura.impulsedata.model.Usuario;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuthException;

@Service
public class AuthService {

    private final Firestore firestore;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final FirebaseAuthService firebaseAuthService;
    private final FirestoreService firestoreService;

    public AuthService(Firestore firestore, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager, FirebaseAuthService firebaseAuthService,
            FirestoreService firestoreService) {
        this.firestore = firestore;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.firebaseAuthService = firebaseAuthService;
        this.firestoreService = firestoreService;
    }

    public String registro(RegistroRequest request) {
        try {
            // Verificar si el usuario ya existe
            var usuarioExistente = firestore.collection("usuarios")
                    .whereEqualTo("email", request.getEmail())
                    .get()
                    .get()
                    .getDocuments();

            if (!usuarioExistente.isEmpty()) {
                throw new RuntimeException("El email ya está registrado");
            }

            String uid = null;
            try {
                // Crear usuario en Firebase Authentication
                uid = firebaseAuthService.crearUsuario(
                    request.getEmail(), 
                    request.getPassword(), 
                    request.getNombre()
                );
            } catch (FirebaseAuthException e) {
                // Comprobar si es el error de demasiados intentos
                if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER")) {
                    throw new RuntimeException("Se han realizado demasiados intentos de registro. Por favor, inténtalo de nuevo más tarde (15-30 minutos).");
                }
                throw e;
            }

            // Crear nuevo usuario en Firestore
            var usuario = new Usuario(
                    request.getEmail(),
                    passwordEncoder.encode(request.getPassword()),
                    request.getNombre(),
                    "USER");
                    
            usuario.setEmailVerificado(false); // Por defecto, el email no está verificado

            // Guardar en Firestore
            var docRef = firestore.collection("usuarios").document(uid); // Usamos el UID de Firebase Auth
            usuario.setId(docRef.getId());
            docRef.set(usuario).get();

            // Intenta enviar correo de verificación, pero no falla si no puede
            try {
                firebaseAuthService.enviarEmailVerificacion(uid);
            } catch (FirebaseAuthException e) {
                // Solo registramos el error pero no interrumpimos el proceso
                if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER")) {
                    System.err.println("Demasiados intentos de envío de verificación. El usuario deberá solicitar un nuevo correo más tarde.");
                } else {
                    System.err.println("No se pudo enviar el correo de verificación: " + e.getMessage());
                }
                // El registro sigue siendo exitoso, el usuario puede solicitar el reenvío después
            }

            // Generar token (aunque el usuario no podrá acceder hasta verificar su email)
            return jwtService.generateToken(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar el usuario: " + e.getMessage());
        }
    }

    public String login(LoginRequest request) {
        try {
            // Verificar si el email está verificado en Firebase
            boolean emailVerificadoFirebase = firebaseAuthService.isEmailVerificado(request.getEmail());
            
            // Buscar usuario en Firestore primero para evitar múltiples consultas
            var usuarioDoc = firestore.collection("usuarios")
                    .whereEqualTo("email", request.getEmail())
                    .get()
                    .get()
                    .getDocuments()
                    .get(0);

            var usuario = usuarioDoc.toObject(Usuario.class);
            if (usuario == null) {
                throw new RuntimeException("Usuario no encontrado");
            }
            
            // Si está verificado en Firebase pero no en nuestra base, actualizamos
            if (emailVerificadoFirebase && !usuario.isEmailVerificado()) {
                usuario.setEmailVerificado(true);
                firestore.collection("usuarios").document(usuario.getId()).update("emailVerificado", true).get();
                System.out.println("Email verificado actualizado para usuario: " + usuario.getEmail());
            }
            
            // Si no está verificado en Firebase, no permitimos login
            if (!emailVerificadoFirebase) {
                throw new RuntimeException("Por favor, verifica tu dirección de correo electrónico antes de iniciar sesión");
            }

            // Autenticar usuario
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            // Generar token
            return jwtService.generateToken(usuario);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Credenciales inválidas", e);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Error de autenticación con Firebase: " + e.getMessage(), e);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error al acceder a Firestore", e);
        }
    }

    /**
     * Verificar el email de un usuario
     * 
     * @param uid UID del usuario
     * @return true si se verificó correctamente, false en caso contrario
     */
    public boolean verificarEmail(String uid) {
        try {
            // Verificar el email en Firebase Auth
            firebaseAuthService.verificarEmail(uid);
            
            // Actualizar el estado en Firestore
            firestore.collection("usuarios").document(uid).update("emailVerificado", true);
            
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Error al verificar el email: " + e.getMessage());
        }
    }

    /**
     * Reenviar correo de verificación
     * 
     * @param email Email del usuario
     * @return Mensaje de confirmación
     */
    public String reenviarVerificacion(String email) {
        try {
            // Intentamos con Firebase
            firebaseAuthService.reenviarEmailVerificacion(email);
            return "Se ha enviado un nuevo correo de verificación a tu dirección de email.";
        } catch (FirebaseAuthException e) {
            // Para errores como demasiados intentos, informamos al usuario
            if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER") || 
                e.getMessage().contains("TOO_MANY_ATTEMPTS")) {
                throw new RuntimeException("Se han realizado demasiados intentos de envío. Por favor, inténtalo de nuevo más tarde (15-30 minutos).");
            }
            // Para otros errores, simplemente propagamos el mensaje
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * Envía un correo de verificación al usuario con el email proporcionado
     * 
     * @param email Email del usuario
     * @return Mensaje de confirmación
     */
    public String enviarVerificacion(String email) {
        // Buscar el UID del usuario por email
        String uid = firestoreService.buscarUsuarioPorEmail(email);
        if (uid == null) {
            throw new RuntimeException("No se encontró ningún usuario con el email proporcionado.");
        }
        
        try {
            // Intentar enviar verificación con Firebase
            firebaseAuthService.enviarEmailVerificacion(uid);
            return "Correo de verificación enviado correctamente. Por favor, revisa tu bandeja de entrada.";
        } catch (FirebaseAuthException e) {
            // Si es error de demasiados intentos, damos un mensaje claro
            if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER") || 
                e.getMessage().contains("TOO_MANY_ATTEMPTS")) {
                throw new RuntimeException("Se han realizado demasiados intentos de envío. Por favor, inténtalo de nuevo más tarde (15-30 minutos).");
            }
            throw new RuntimeException("Error al enviar el correo de verificación: " + e.getMessage());
        }
    }

    /**
     * Método administrativo para forzar la verificación de email
     * Este método actualiza tanto Firebase Auth como Firestore
     * 
     * @param email Email del usuario a verificar
     * @throws RuntimeException Si ocurre algún error durante el proceso
     */
    public void forzarVerificacionEmail(String email) {
        try {
            // 1. Obtener el UID del usuario
            String uid = firestoreService.buscarUsuarioPorEmail(email);
            if (uid == null) {
                throw new RuntimeException("No se encontró ningún usuario con el email proporcionado.");
            }
            
            // 2. Actualizar el estado en Firebase Auth
            firebaseAuthService.verificarEmail(uid);
            
            // 3. Actualizar el estado en Firestore
            firestore.collection("usuarios").document(uid).update("emailVerificado", true).get();
            
            System.out.println("Email verificado manualmente para usuario: " + email);
        } catch (Exception e) {
            throw new RuntimeException("Error al forzar la verificación del email: " + e.getMessage());
        }
    }
} 