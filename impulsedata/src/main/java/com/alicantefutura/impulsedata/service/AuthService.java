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
import com.google.firebase.auth.ActionCodeSettings;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;

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
            System.out.println("Iniciando registro para: " + request.getEmail());
            String email = request.getEmail();
            
            // 1. Comprobar si el email existe en Firebase Auth
            boolean existeEnAuth = false;
            try {
                // Intentamos obtener el usuario por email para ver si ya existe en Firebase Auth
                firebaseAuthService.getUserByEmail(email);
                existeEnAuth = true;
                System.out.println("El usuario ya existe en Firebase Auth: " + email);
            } catch (FirebaseAuthException e) {
                // Si el error es USER_NOT_FOUND, significa que el usuario no existe (lo que queremos)
                if (e.getMessage().contains("USER_NOT_FOUND")) {
                    existeEnAuth = false;
                } else {
                    // Para otros errores, propagamos la excepción
                    throw e;
                }
            }
            
            // 2. Verificar si el usuario ya existe en Firestore
            var usuarioExistente = firestore.collection("usuarios")
                    .whereEqualTo("email", email)
                    .get()
                    .get()
                    .getDocuments();

            boolean existeEnFirestore = !usuarioExistente.isEmpty();
            System.out.println("Usuario existente en Firestore: " + existeEnFirestore);

            // 3. Manejar diferentes casos de existencia
            String uid = null;
            
            if (existeEnAuth && existeEnFirestore) {
                throw new RuntimeException("El email ya está registrado");
            } else if (existeEnAuth && !existeEnFirestore) {
                // Usuario existe en Auth pero no en Firestore
                // Obtenemos el UID del usuario existente
                try {
                    uid = firebaseAuthService.getUserByEmail(email).getUid();
                    System.out.println("Recuperando UID de usuario existente en Auth: " + uid);
                } catch (Exception e) {
                    throw new RuntimeException("Error al recuperar usuario existente: " + e.getMessage());
                }
            } else if (!existeEnAuth) {
                // El usuario no existe en Auth, procedemos a crearlo
                try {
                    uid = firebaseAuthService.crearUsuario(
                        request.getEmail(), 
                        request.getPassword(), 
                        request.getNombreUsuario()
                    );
                    System.out.println("Usuario creado en Firebase Auth con UID: " + uid);
                } catch (FirebaseAuthException e) {
                    // Comprobar si es el error de demasiados intentos
                    if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER")) {
                        throw new RuntimeException("Se han realizado demasiados intentos de registro. Por favor, inténtalo de nuevo más tarde (15-30 minutos).");
                    } else if (e.getMessage().contains("EMAIL_EXISTS")) {
                        // Si por alguna razón llegamos aquí, intentamos recuperar el UID
                        try {
                            uid = firebaseAuthService.getUserByEmail(email).getUid();
                            System.out.println("Recuperando UID después de error EMAIL_EXISTS: " + uid);
                        } catch (Exception innerEx) {
                            System.err.println("Error al recuperar usuario después de EMAIL_EXISTS: " + innerEx.getMessage());
                            throw new RuntimeException("Este email ya está registrado. Si es tuyo, intenta iniciar sesión.");
                        }
                    } else {
                        throw e;
                    }
                }
            }

            if (uid == null) {
                throw new RuntimeException("No se pudo obtener un UID válido para el usuario");
            }

            try {
                // Crear nuevo usuario en Firestore
                var usuario = new Usuario(
                        request.getEmail(),
                        passwordEncoder.encode(request.getPassword()),
                        request.getNombreUsuario(),
                        "USER");
                        
                usuario.setEmailVerificado(false); // Por defecto, el email no está verificado
                
                // Guardar en Firestore usando el nuevo método
                boolean guardadoExitoso = firestoreService.guardarUsuario(usuario, uid);
                
                if (!guardadoExitoso) {
                    throw new RuntimeException("No se pudo guardar el usuario en la base de datos");
                }
                
                // Intenta enviar correo de verificación, pero no falla si no puede
                try {
                    System.out.println("Enviando email de verificación...");
                    firebaseAuthService.enviarEmailVerificacion(uid);
                    System.out.println("Email de verificación enviado correctamente");
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
                System.err.println("Error al guardar el usuario en Firestore: " + e.getMessage());
                e.printStackTrace();
                
                // Si falla la creación en Firestore pero acabamos de crear el usuario en Auth,
                // intentamos eliminar el usuario de Firebase Auth para mantener consistencia
                try {
                    if (uid != null && !existeEnAuth) {
                        System.out.println("Eliminando usuario de Firebase Auth debido a error en Firestore");
                        FirebaseAuth.getInstance().deleteUser(uid);
                    }
                } catch (Exception deleteError) {
                    System.err.println("No se pudo eliminar el usuario de Firebase Auth: " + deleteError.getMessage());
                }
                
                throw new RuntimeException("Error al crear el usuario en la base de datos: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error general en el registro: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al registrar el usuario: " + e.getMessage());
        }
    }

    public String login(LoginRequest request) {
        try {
            // Buscar usuario en Firestore primero para evitar múltiples consultas
            var querySnapshot = firestore.collection("usuarios")
                    .whereEqualTo("email", request.getIdentificador())
                    .get()
                    .get();

            // Si no se encuentra por email, intentar por nombreUsuario
            if (querySnapshot.isEmpty()) {
                querySnapshot = firestore.collection("usuarios")
                        .whereEqualTo("nombreUsuario", request.getIdentificador())
                        .get()
                        .get();
            }
            
            // Verificar si se encontró algún usuario
            if (querySnapshot.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado");
            }
            
            var usuarioDoc = querySnapshot.getDocuments().get(0);
            var usuario = usuarioDoc.toObject(Usuario.class);
            if (usuario == null) {
                throw new RuntimeException("Usuario no encontrado");
            }
            
            // Verificar si el email está verificado en Firebase
            boolean emailVerificadoFirebase = firebaseAuthService.isEmailVerificado(usuario.getEmail());
            
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

            // Autenticar usuario (usando el email real del usuario encontrado)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(usuario.getEmail(), request.getPassword()));

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
        // 1. Primero comprobar si el usuario existe en Firebase Auth
        UserRecord userRecord = null;
        try {
            userRecord = firebaseAuthService.getUserByEmail(email);
            System.out.println("Usuario encontrado en Firebase Auth: " + email + " con UID: " + userRecord.getUid());
        } catch (FirebaseAuthException e) {
            if (e.getMessage().contains("USER_NOT_FOUND")) {
                throw new RuntimeException("No se encontró ningún usuario con el email proporcionado: " + email);
            }
            throw new RuntimeException("Error al verificar el usuario en Firebase: " + e.getMessage());
        }
        
        // 2. Luego, verificar si existe en Firestore
        String uid = firestoreService.buscarUsuarioPorEmail(email);
        
        // 3. Si existe en Auth pero no en Firestore, intentamos recuperar automáticamente
        if (uid == null && userRecord != null) {
            System.out.println("Usuario existe en Auth pero no en Firestore. Intentando recuperación automática.");
            try {
                // Crear el documento en Firestore usando el UID de Auth
                var usuario = new Usuario(
                    email,
                    "*RECUPERADO*", // Contraseña temporal, requerirá cambio
                    userRecord.getDisplayName() != null ? userRecord.getDisplayName() : "Usuario",
                    "USER"
                );
                usuario.setEmailVerificado(userRecord.isEmailVerified());
                
                boolean guardadoExitoso = firestoreService.guardarUsuario(usuario, userRecord.getUid());
                if (guardadoExitoso) {
                    System.out.println("Usuario recuperado exitosamente en Firestore.");
                    uid = userRecord.getUid();
                } else {
                    throw new RuntimeException("No se pudo recuperar la cuenta del usuario. Por favor, contacte al soporte.");
                }
            } catch (Exception ex) {
                System.err.println("Error al recuperar usuario: " + ex.getMessage());
                throw new RuntimeException("Error al recuperar la cuenta. Por favor, contacte al soporte.");
            }
        }
        
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

    /**
     * Obtiene el enlace de verificación para un usuario sin enviarlo por correo
     * (solo para desarrollo)
     * 
     * @param email Email del usuario
     * @return El enlace de verificación
     */
    public String obtenerEnlaceVerificacion(String email) {
        // Buscar el UID del usuario por email
        String uid = firestoreService.buscarUsuarioPorEmail(email);
        if (uid == null) {
            throw new RuntimeException("No se encontró ningún usuario con el email proporcionado.");
        }
        
        try {
            // Configurar las opciones del enlace de correo
            ActionCodeSettings actionCodeSettings = ActionCodeSettings.builder()
                    .setUrl("http://localhost:5173/login") // URL a donde redirigir después de verificar
                    .setHandleCodeInApp(true)              // Manejar el código en la app
                    .build();
            
            // Obtener el correo del usuario
            String userEmail = FirebaseAuth.getInstance().getUser(uid).getEmail();
            
            // Generar el enlace de verificación
            String link = FirebaseAuth.getInstance().generateEmailVerificationLink(
                    userEmail, 
                    actionCodeSettings
            );
            
            return link;
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Error al generar el enlace de verificación: " + e.getMessage());
        }
    }

    /**
     * Actualiza la contraseña de un usuario
     * 
     * @param email       Email del usuario
     * @param oldPassword Contraseña actual
     * @param newPassword Nueva contraseña
     * @param token       Token de autenticación
     * @return true si se actualizó correctamente, false en caso contrario
     */
    public boolean actualizarPassword(String email, String oldPassword, String newPassword, String token) {
        try {
            // Verificar que el token es válido y corresponde al usuario
            String emailFromToken = jwtService.extractUsername(token);
            if (!email.equals(emailFromToken)) {
                throw new RuntimeException("El email del token no coincide con el proporcionado");
            }

            // Autenticar el usuario con sus credenciales actuales
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, oldPassword));

            // Buscar usuario en Firestore
            var documentos = firestore.collection("usuarios")
                    .whereEqualTo("email", email)
                    .get()
                    .get()
                    .getDocuments();

            if (documentos.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado");
            }

            var usuarioDoc = documentos.get(0);
            String uid = usuarioDoc.getId();
            var usuario = usuarioDoc.toObject(Usuario.class);

            // Actualizar la contraseña en Firebase Auth
            firebaseAuthService.actualizarPassword(uid, newPassword);

            // Actualizar la contraseña en Firestore
            String encodedPassword = passwordEncoder.encode(newPassword);
            firestore.collection("usuarios").document(uid)
                    .update("password", encodedPassword)
                    .get();

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar la contraseña: " + e.getMessage());
        }
    }
} 