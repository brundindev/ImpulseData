package com.alicantefutura.impulsedata.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.alicantefutura.impulsedata.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        
        // Excluir rutas públicas del filtrado JWT
        return path.startsWith("/api/cloudinary/") ||
               path.startsWith("/api/auth/login") || 
               path.startsWith("/api/auth/registro") ||
               path.startsWith("/swagger-ui") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/swagger-resources");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Excluir Swagger y documentación OpenAPI de la autenticación
        if (requestPath.startsWith("/swagger-ui") ||
                requestPath.startsWith("/v3/api-docs") ||
                requestPath.startsWith("/swagger-resources")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            // Aquí va la validación del token de Firebase
        }

        final String userEmail;

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        userEmail = jwtService.extractUsername(token);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userDetails = userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(token, userDetails)) {
                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}