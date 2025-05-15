package com.alicantefutura.impulsedata.model;

import java.time.LocalDateTime;

public class CookiePreference {

    private String id;
    private String userId;
    private boolean necessaryCookies = true;
    private boolean analyticsCookies = false;
    private boolean marketingCookies = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructor por defecto necesario para Firebase
    public CookiePreference() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor con parámetros
    public CookiePreference(String userId, boolean necessaryCookies, boolean analyticsCookies, boolean marketingCookies) {
        this.userId = userId;
        this.necessaryCookies = necessaryCookies;
        this.analyticsCookies = analyticsCookies;
        this.marketingCookies = marketingCookies;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isNecessaryCookies() {
        return necessaryCookies;
    }

    public void setNecessaryCookies(boolean necessaryCookies) {
        this.necessaryCookies = necessaryCookies;
    }

    public boolean isAnalyticsCookies() {
        return analyticsCookies;
    }

    public void setAnalyticsCookies(boolean analyticsCookies) {
        this.analyticsCookies = analyticsCookies;
    }

    public boolean isMarketingCookies() {
        return marketingCookies;
    }

    public void setMarketingCookies(boolean marketingCookies) {
        this.marketingCookies = marketingCookies;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
} 