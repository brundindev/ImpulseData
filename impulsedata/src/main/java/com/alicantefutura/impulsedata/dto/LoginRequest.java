package com.alicantefutura.impulsedata.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "El identificador es obligatorio")
    private String identificador; // Puede ser email o nombreUsuario

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    // Getters y setters
    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
} 