package com.alicantefutura.impulsedata.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.google.firebase.auth.ActionCodeSettings;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;
import com.google.firebase.auth.UserRecord.UpdateRequest;

@Service
public class FirebaseAuthService {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseAuthService.class);
    
    // Cache para verificación de email (email -> [isVerificado, timestamp])
    private final Map<String, Object[]> emailVerificadoCache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL_MS = 60000; // 1 minuto de validez para el caché

    /**
     * Crear un usuario en Firebase Authentication
     * 
     * @param email    Email del usuario
     * @param password Contraseña del usuario
     * @param nombre   Nombre del usuario
     * @return El UID del usuario creado
     * @throws FirebaseAuthException Si ocurre un error al crear el usuario
     */
    public String crearUsuario(String email, String password, String nombre) throws FirebaseAuthException {
        logger.info("Iniciando creación de usuario en Firebase Auth: {}", email);
        try {
            CreateRequest request = new CreateRequest()
                    .setEmail(email)
                    .setPassword(password)
                    .setDisplayName(nombre)
                    .setEmailVerified(false) // Por defecto, el email no está verificado
                    .setDisabled(false);
    
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
            logger.info("Usuario creado en Firebase Auth con UID: {}", userRecord.getUid());
            
            // No enviamos el email de verificación aquí para evitar excepciones que interrumpan el flujo
            // Se enviará después de guardar en Firestore
            
            return userRecord.getUid();
        } catch (FirebaseAuthException e) {
            logger.error("Error al crear usuario en Firebase Auth: {} - {}", email, e.getMessage());
            if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER")) {
                logger.error("Demasiados intentos de registro para: {}", email);
            } else if (e.getMessage().contains("EMAIL_EXISTS")) {
                logger.error("El email ya está registrado: {}", email);
            }
            throw e;
        } catch (Exception e) {
            logger.error("Error inesperado al crear usuario en Firebase Auth: {}", e.getMessage());
            throw new RuntimeException("Error inesperado al crear usuario: " + e.getMessage(), e);
        }
    }

    /**
     * Envía un correo de verificación a un usuario de Firebase
     * 
     * @param uid El UID del usuario
     * @throws FirebaseAuthException Si ocurre un error en Firebase Auth
     */
    public void enviarEmailVerificacion(String uid) throws FirebaseAuthException {
        try {
            // Configurar las opciones del enlace de correo
            ActionCodeSettings actionCodeSettings = ActionCodeSettings.builder()
                    .setUrl("http://localhost:5173/login") // URL a donde redirigir después de verificar
                    .setHandleCodeInApp(true)              // Manejar el código en la app
                    .build();
            
            // Obtener el usuario y su email
            String email = getUserEmail(uid);
            

            
            // NOTA: Firebase NO envía el correo automáticamente, solo genera el enlace
            // En producción deberías conectar esto con un servicio de correo electrónico
            logger.info("Enlace de verificación generado para usuario {}: {}", uid);
        } catch (FirebaseAuthException e) {
            logger.error("Error al generar enlace de verificación: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Verificar el email de un usuario
     * 
     * @param uid UID del usuario
     * @throws FirebaseAuthException Si ocurre un error al verificar el email
     */
    public void verificarEmail(String uid) throws FirebaseAuthException {
        UpdateRequest request = new UpdateRequest(uid)
                .setEmailVerified(true);
        
        FirebaseAuth.getInstance().updateUser(request);
        
        // Invalidar caché para este usuario
        try {
            String email = FirebaseAuth.getInstance().getUser(uid).getEmail();
            emailVerificadoCache.remove(email);
        } catch (Exception e) {
            logger.warn("No se pudo invalidar caché para UID: {}", uid);
        }
    }

    /**
     * Comprueba si el email de un usuario está verificado
     * 
     * @param email Email del usuario
     * @return true si el email está verificado, false en caso contrario
     * @throws FirebaseAuthException Si ocurre un error al comprobar el email
     */
    public boolean isEmailVerificado(String email) throws FirebaseAuthException {
        // Primero intentamos usar el caché
        if (emailVerificadoCache.containsKey(email)) {
            Object[] cachedData = emailVerificadoCache.get(email);
            long timestamp = (long) cachedData[1];
            long now = System.currentTimeMillis();
            
            // Si el caché es reciente (menos de 1 minuto), lo usamos
            if (now - timestamp < CACHE_TTL_MS) {
                boolean cachedResult = (boolean) cachedData[0];
                logger.info("Usando caché para verificación de email {}: {}", email, cachedResult);
                return cachedResult;
            } else {
                // Si ha expirado, lo eliminamos del caché
                emailVerificadoCache.remove(email);
            }
        }
        
        // Si no estaba en caché o ha expirado, consultamos a Firebase
        try {
            long startTime = System.currentTimeMillis();
            UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
            boolean isVerified = userRecord.isEmailVerified();
            long endTime = System.currentTimeMillis();
            
            // Guardamos en caché
            emailVerificadoCache.put(email, new Object[]{isVerified, System.currentTimeMillis()});
            
            // Registrar con fines de depuración
            logger.info("Verificando email para usuario: {} - Estado de verificación: {} - Tiempo: {}ms", 
                email, isVerified, (endTime - startTime));
                
            return isVerified;
        } catch (FirebaseAuthException e) {
            logger.error("Error al verificar email: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Reenviar correo de verificación a un usuario existente
     * 
     * @param email Email del usuario
     * @throws FirebaseAuthException Si ocurre un error al reenviar
     */
    public void reenviarEmailVerificacion(String email) throws FirebaseAuthException {
        try {
            // Buscar el usuario por email
            UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
            
            // Verificar si el email ya está verificado
            if (userRecord.isEmailVerified()) {
                throw new RuntimeException("Este email ya ha sido verificado. No es necesario reenviar la verificación.");
            }
            
            // Configurar las opciones del enlace
            ActionCodeSettings actionCodeSettings = ActionCodeSettings.builder()
                    .setUrl("http://localhost:5173/login") // URL de retorno después de verificar
                    .setHandleCodeInApp(true)
                    .build();
            
            // Generar y enviar el enlace de verificación
            String link = FirebaseAuth.getInstance().generateEmailVerificationLink(
                    email, 
                    actionCodeSettings
            );
            
            // Log del enlace generado
            logger.info("Link de verificación reenviado para usuario {}: {}", userRecord.getUid(), link);
            
        } catch (FirebaseAuthException e) {
            if (e.getMessage().contains("TOO_MANY_ATTEMPTS_TRY_LATER")) {
                logger.error("Demasiados intentos de reenvío para el usuario con email: {}", email);
                throw new RuntimeException("Se han realizado demasiados intentos. Por favor, intenta de nuevo más tarde (15-30 minutos).");
            } else if (e.getMessage().contains("USER_NOT_FOUND")) {
                logger.error("Intento de reenvío a usuario inexistente: {}", email);
                throw new RuntimeException("No existe ningún usuario registrado con ese correo electrónico.");
            }
            logger.error("Error al reenviar verificación: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Obtiene el email de un usuario por su UID
     * 
     * @param uid UID del usuario
     * @return Email del usuario
     * @throws FirebaseAuthException Si ocurre un error al obtener el usuario
     */
    private String getUserEmail(String uid) throws FirebaseAuthException {
        return FirebaseAuth.getInstance().getUser(uid).getEmail();
    }

    /**
     * Obtiene un usuario de Firebase por su email
     * 
     * @param email Email del usuario
     * @return UserRecord con los datos del usuario
     * @throws FirebaseAuthException Si ocurre un error al obtener el usuario
     */
    public UserRecord getUserByEmail(String email) throws FirebaseAuthException {
        try {
            return FirebaseAuth.getInstance().getUserByEmail(email);
        } catch (FirebaseAuthException e) {
            logger.error("Error al obtener usuario por email: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Actualiza la contraseña de un usuario en Firebase Auth
     * 
     * @param uid         UID del usuario
     * @param newPassword Nueva contraseña
     * @throws FirebaseAuthException Si ocurre un error al actualizar la contraseña
     */
    public void actualizarPassword(String uid, String newPassword) throws FirebaseAuthException {
        try {
            logger.info("Actualizando contraseña para usuario en Firebase Auth: {}", uid);
            
            UpdateRequest request = new UpdateRequest(uid)
                    .setPassword(newPassword);
            
            FirebaseAuth.getInstance().updateUser(request);
            
            logger.info("Contraseña actualizada correctamente para usuario: {}", uid);
        } catch (FirebaseAuthException e) {
            logger.error("Error al actualizar contraseña: {}", e.getMessage());
            throw e;
        }
    }
} 