package com.alicantefutura.impulsedata.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "cookie_preferences")
public class CookiePreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "necessary_cookies")
    private boolean necessaryCookies = true;

    @Column(name = "analytics_cookies")
    private boolean analyticsCookies = false;

    @Column(name = "marketing_cookies")
    private boolean marketingCookies = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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
} 