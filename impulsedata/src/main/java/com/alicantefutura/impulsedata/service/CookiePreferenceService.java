package com.alicantefutura.impulsedata.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alicantefutura.impulsedata.dto.CookiePreferenceDTO;
import com.alicantefutura.impulsedata.model.CookiePreference;
import com.alicantefutura.impulsedata.repository.CookiePreferenceRepository;

@Service
public class CookiePreferenceService {

    private final CookiePreferenceRepository cookiePreferenceRepository;

    @Autowired
    public CookiePreferenceService(CookiePreferenceRepository cookiePreferenceRepository) {
        this.cookiePreferenceRepository = cookiePreferenceRepository;
    }

    public CookiePreference savePreferences(CookiePreferenceDTO cookiePreferenceDTO) {
        String userId = cookiePreferenceDTO.getUserId();
        
        // Buscar preferencias existentes o crear nuevas
        CookiePreference cookiePreference = cookiePreferenceRepository.findByUserId(userId)
                .orElse(new CookiePreference());
        
        // Actualizar los datos
        cookiePreference.setUserId(userId);
        cookiePreference.setNecessaryCookies(cookiePreferenceDTO.getPreferences().isNecessary());
        cookiePreference.setAnalyticsCookies(cookiePreferenceDTO.getPreferences().isAnalytics());
        cookiePreference.setMarketingCookies(cookiePreferenceDTO.getPreferences().isMarketing());
        
        // Guardar en la base de datos
        return cookiePreferenceRepository.save(cookiePreference);
    }

    public Optional<CookiePreference> getPreferencesByUserId(String userId) {
        return cookiePreferenceRepository.findByUserId(userId);
    }
} 