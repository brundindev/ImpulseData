package com.alicantefutura.impulsedata.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class Usuario implements UserDetails {
    private String id;
    private String email;
    private String password;
    private String nombreUsuario;
    private String rol;
    private boolean emailVerificado;

    public Usuario() {
        this.emailVerificado = false; // Por defecto, el email no está verificado
    }

    public Usuario(String email, String password, String nombreUsuario, String rol) {
        this.email = email;
        this.password = password;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
        this.emailVerificado = false; // Por defecto, el email no está verificado
    }

    // Getters y setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
    
    public boolean isEmailVerificado() {
        return emailVerificado;
    }
    
    public void setEmailVerificado(boolean emailVerificado) {
        this.emailVerificado = emailVerificado;
    }

    // Implementación de UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Solo se habilita la cuenta si el email está verificado
        return emailVerificado;
    }
    
    @Override
    public String toString() {
        return "Usuario{" +
               "id='" + id + '\'' +
               ", email='" + email + '\'' +
               ", nombreUsuario='" + nombreUsuario + '\'' +
               ", rol='" + rol + '\'' +
               ", emailVerificado=" + emailVerificado +
               '}';
    }
} 