package com.impulsadata.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Date;

@Component
public class JWTUtils {

    private static final Logger logger = LoggerFactory.getLogger(JWTUtils.class);

    @Value("${jwt.secret:default-secret-value}")
    private String JWT_SECRET;

    @Value("${jwt.expiration:86400000}")
    private long EXPIRATION_TIME;

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);
        return Jwts.builder().setSubject(username).setIssuedAt(now).setExpiration(expiryDate).signWith(SignatureAlgorithm.HS256, JWT_SECRET).compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            logger.error("Token expirado: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Token no soportado: " + e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Token malformado: " + e.getMessage());
        } catch (SignatureException e) {
            logger.error("Firma inválida: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Token vacío o con espacios: " + e.getMessage());
        }
        return false;
    }
}
