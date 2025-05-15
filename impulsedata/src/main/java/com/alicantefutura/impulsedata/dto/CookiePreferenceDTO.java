package com.alicantefutura.impulsedata.dto;

public class CookiePreferenceDTO {
    private String userId;
    private CookiePreferences preferences;

    public static class CookiePreferences {
        private boolean necessary;
        private boolean analytics;
        private boolean marketing;

        // Getters y Setters
        public boolean isNecessary() {
            return necessary;
        }

        public void setNecessary(boolean necessary) {
            this.necessary = necessary;
        }

        public boolean isAnalytics() {
            return analytics;
        }

        public void setAnalytics(boolean analytics) {
            this.analytics = analytics;
        }

        public boolean isMarketing() {
            return marketing;
        }

        public void setMarketing(boolean marketing) {
            this.marketing = marketing;
        }
    }

    // Getters y Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public CookiePreferences getPreferences() {
        return preferences;
    }

    public void setPreferences(CookiePreferences preferences) {
        this.preferences = preferences;
    }
} 