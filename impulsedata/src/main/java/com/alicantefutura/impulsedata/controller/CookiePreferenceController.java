package com.alicantefutura.impulsedata.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alicantefutura.impulsedata.dto.CookiePreferenceDTO;
import com.alicantefutura.impulsedata.model.CookiePreference;
import com.alicantefutura.impulsedata.service.CookiePreferenceService;

@RestController
@RequestMapping("/api/cookies")
public class CookiePreferenceController {

    private final CookiePreferenceService cookiePreferenceService;

    @Autowired
    public CookiePreferenceController(CookiePreferenceService cookiePreferenceService) {
        this.cookiePreferenceService = cookiePreferenceService;
    }

    @PostMapping("/preferences")
    public ResponseEntity<Map<String, Object>> savePreferences(@RequestBody CookiePreferenceDTO cookiePreferenceDTO) {
        try {
            CookiePreference savedPreference = cookiePreferenceService.savePreferences(cookiePreferenceDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Preferencias de cookies guardadas correctamente");
            response.put("data", savedPreference);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al guardar preferencias de cookies");
            errorResponse.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/preferences/{userId}")
    public ResponseEntity<Map<String, Object>> getPreferences(@PathVariable String userId) {
        Optional<CookiePreference> preference = cookiePreferenceService.getPreferencesByUserId(userId);
        
        Map<String, Object> response = new HashMap<>();
        
        if (preference.isPresent()) {
            response.put("success", true);
            response.put("data", preference.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "No se encontraron preferencias para el usuario");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
} 