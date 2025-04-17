package com.alicantefutura.impulsedata.dto;

public class LoginRequest {
    // Permitimos que el cliente envíe cualquiera de estos campos
    private String identificador; // Mantenemos para compatibilidad
    private String email;
    private String nombreUsuario;

    private String password;

    // Getters y setters
    public String getIdentificador() {
        // Si identificador no se especificó pero sí email o nombreUsuario, usamos el que esté disponible
        if (identificador == null) {
            if (email != null) {
                return email;
            } else if (nombreUsuario != null) {
                return nombreUsuario;
            }
        }
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
} 