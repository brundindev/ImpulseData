package com.alicantefutura.impulsedata.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alicantefutura.impulsedata.dto.LoginRequest;
import com.alicantefutura.impulsedata.dto.RegistroRequest;
import com.alicantefutura.impulsedata.model.Usuario;
import com.google.cloud.firestore.Firestore;

@Service
public class AuthService {

    private final Firestore firestore;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(Firestore firestore, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.firestore = firestore;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
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

            // Crear nuevo usuario
            var usuario = new Usuario(
                    request.getEmail(),
                    passwordEncoder.encode(request.getPassword()),
                    request.getNombre(),
                    "USER");

            // Guardar en Firestore
            var docRef = firestore.collection("usuarios").document();
            usuario.setId(docRef.getId());
            docRef.set(usuario).get();

            // Generar token
            return jwtService.generateToken(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar el usuario: " + e.getMessage());
        }
    }

    public String login(LoginRequest request) {
        try {
            // Autenticar usuario
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            // Buscar usuario en Firestore
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

            // Generar token
            return jwtService.generateToken(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error en la autenticación: " + e.getMessage());
        }
    }
} 